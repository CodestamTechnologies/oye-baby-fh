"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { auth, db } from "@/lib/firebase";
import {
    User,
    onAuthStateChanged,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, query, where } from "firebase/firestore";
import { Clock, Mail, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getDocs, collection } from "firebase/firestore";
import { Order } from "@/lib/types";

// Define types for Firestore user data
interface FirestoreUserData {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    lastLogin: string;
    createdAt: string;
}
interface FirestoreUserwithOrderData {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    lastLogin: string;
    createdAt: string;
    orders?: Order[];
}

// Define types for the context
interface AuthContextType {
    user: User | null;
    allusers: FirestoreUserwithOrderData[];
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    openLoginModal: () => void;
    closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    firestoreUserData: FirestoreUserData | null;
    isSignupMode: boolean;
    setIsSignupMode: (mode: boolean) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    error: string | null;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const LoginModal = ({
    isOpen,
    onClose,
    user,
    firestoreUserData,
    isSignupMode,
    setIsSignupMode,
    email,
    setEmail,
    password,
    setPassword,
    error,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout,
}: LoginModalProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleAuthAction = async (authFunction: () => Promise<void>) => {
        setIsLoading(true);
        try {
            await authFunction();
        } catch {
            // Error handling is done in the auth functions
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => { }, []);
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl">
                        {user
                            ? "My Account"
                            : isSignupMode
                                ? "Create Account"
                                : "Welcome Back"}
                    </DialogTitle>
                    {!user && (
                        <CardDescription>
                            {isSignupMode
                                ? "Join Florcent & Hampers to access exclusive offers and faster checkout."
                                : "Sign in to your Florcent & Hampers account"}
                        </CardDescription>
                    )}
                </DialogHeader>

                {user && firestoreUserData ? (
                    <Card className="border-0 shadow-none">
                        <CardContent className="space-y-6 pt-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage
                                        src={firestoreUserData.photoURL || undefined}
                                        alt="Profile"
                                    />
                                    <AvatarFallback className="bg-blue-100 text-blue-800">
                                        {firestoreUserData.displayName?.charAt(0).toUpperCase() ||
                                            firestoreUserData.email?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium text-lg">
                                        {firestoreUserData.displayName || "Customer"}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Mail className="mr-1 h-3 w-3" />
                                        {firestoreUserData.email}
                                    </div>
                                    <Badge variant="outline" className="mt-1">
                                        Florcent Member
                                    </Badge>
                                </div>
                            </div>

                            <Separator />

                            <div className="text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                        Last login:{" "}
                                        {new Date(firestoreUserData.lastLogin).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <Button onClick={logout} variant="destructive" className="w-full">
                                Sign Out
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4 py-2">
                        {error && (
                            <Alert variant="destructive" className="text-sm">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    autoComplete="email"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete={
                                        isSignupMode ? "new-password" : "current-password"
                                    }
                                />
                            </div>
                        </div>

                        {isSignupMode ? (
                            <Button
                                className="w-full"
                                disabled={isLoading}
                                onClick={() =>
                                    handleAuthAction(() => signUpWithEmail(email, password))
                                }
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Account
                            </Button>
                        ) : (
                            <Button
                                className="w-full"
                                disabled={isLoading}
                                onClick={() =>
                                    handleAuthAction(() => signInWithEmail(email, password))
                                }
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                        )}

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-muted-foreground">
                                    or continue with
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full"
                            disabled={isLoading}
                            onClick={() => handleAuthAction(signInWithGoogle)}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                            )}
                            Google
                        </Button>

                        <div className="text-center text-sm">
                            {isSignupMode ? (
                                <span>
                                    Already have an account?{" "}
                                    <Button
                                        variant="link"
                                        className="p-0 h-auto font-normal"
                                        onClick={() => setIsSignupMode(false)}
                                    >
                                        Sign In
                                    </Button>
                                </span>
                            ) : (
                                <span>
                                    New to Florcent & Hampers?{" "}
                                    <Button
                                        variant="link"
                                        className="p-0 h-auto font-normal"
                                        onClick={() => setIsSignupMode(true)}
                                    >
                                        Create Account
                                    </Button>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [allusers, setAllUser] = useState<FirestoreUserwithOrderData[]>([]);
    const [firestoreUserData, setFirestoreUserData] =
        useState<FirestoreUserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignupMode, setIsSignupMode] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const getAllUsersandtheirOrders = async () => {
        const usersCol = collection(db, "users");
        const usersSnapshot = await getDocs(usersCol);

        const usersList: FirestoreUserData[] = await Promise.all(
            usersSnapshot.docs.map(async (doc) => {
                const data = doc.data();

                // Fetch user's orders
                const ordersRef = collection(db, "orders");
                const q = query(ordersRef, where("email", "==", data.email));
                const ordersSnapshot = await getDocs(q);
                const orders = ordersSnapshot.docs.map((orderDoc) => ({
                    id: orderDoc.id,
                    ...orderDoc.data(),
                }));

                return {
                    uid: data.uid,
                    email: data.email,
                    displayName: data.displayName,
                    photoURL: data.photoURL,
                    lastLogin: data.lastLogin,
                    createdAt: data.createdAt,
                    orders: orders, // Add orders array here
                } as FirestoreUserData;
            })
        );

        setAllUser(usersList);
    };
    // Save user details to Firestore with custom name and image
    const saveUserToFirestore = async (user: User) => {
        const emailName = user.email?.split("@")[0] || "Unknown";
        const displayName = user.displayName || emailName;
        const photoURL =
            user.photoURL ||
            `https://maxm-imggenurl.web.val.run/studio-ghibli-image-of-aperson-named-${displayName}-corporate-headshot-minimal-cartoonic`;

        const userRef = doc(db, "users", user.uid);
        const userData: FirestoreUserData = {
            uid: user.uid,
            email: user.email,
            displayName,
            photoURL,
            lastLogin: new Date().toISOString(),
            createdAt: user.metadata.creationTime || new Date().toISOString(),
        };
        await setDoc(userRef, userData, { merge: true });
        return userData;
    };

    // Fetch user details from Firestore
    const fetchUserFromFirestore = async (uid: string) => {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            setFirestoreUserData(userSnap.data() as FirestoreUserData);
        } else {
            setFirestoreUserData(null);
        }
    };

    // Listen to auth state changes and fetch from Firestore
    useEffect(() => {
        getAllUsersandtheirOrders();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                const updatedData = await saveUserToFirestore(user);
                setFirestoreUserData(updatedData);
                await fetchUserFromFirestore(user.uid);
            } else {
                setFirestoreUserData(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Sign in with Google
    const signInWithGoogle = async () => {
        try {
            const { googleProvider } = await import("@/lib/firebase");
            const result = await signInWithPopup(auth, googleProvider);
            if (result.user) {
                const updatedData = await saveUserToFirestore(result.user);
                setFirestoreUserData(updatedData);
                closeLoginModal();
            }
        } catch (err) {
            console.error("Google sign-in error:", err);
            setError("Google sign-in failed");
        }
    };

    // Sign in with Email/Password (Login only)
    const signInWithEmail = async (email: string, password: string) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            if (result.user) {
                const updatedData = await saveUserToFirestore(result.user);
                setFirestoreUserData(updatedData);
                closeLoginModal();
            }
        } catch (error: unknown) {
            console.error("Email sign-in error:", error);
            if (typeof error === "object" && error !== null && "code" in error) {
                const firebaseError = error as { code: string; message: string };
                toast("Invalid Credentials");
                setError("Sign-in failed: " + firebaseError.message);
            } else {
                setError("An unknown error occurred during sign-in.");
            }
        }
    };

    // Sign up with Email/Password
    const signUpWithEmail = async (email: string, password: string) => {
        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            if (result.user) {
                const updatedData = await saveUserToFirestore(result.user);
                setFirestoreUserData(updatedData);
                closeLoginModal();
            }
        } catch (error: unknown) {
            console.error("Email sign-up error:", error);
            if (typeof error === "object" && error !== null && "code" in error) {
                const firebaseError = error as { code: string; message: string };
                setError("Sign-up failed: " + firebaseError.message);
            } else {
                setError("An unknown error occurred during sign-up.");
            }
        }
    };

    // Logout
    const logout = async () => {
        await signOut(auth);
        setFirestoreUserData(null);
    };

    // Open login modal
    const openLoginModal = () => {
        setIsLoginModalOpen(true);
        setIsSignupMode(false);
        setError(null);
    };

    // Close login modal
    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
        setEmail("");
        setPassword("");
        setError(null);
        setIsSignupMode(false);
    };

    const value = {
        user,
        allusers,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        openLoginModal,
        closeLoginModal,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={closeLoginModal}
                user={user}
                firestoreUserData={firestoreUserData}
                isSignupMode={isSignupMode}
                setIsSignupMode={setIsSignupMode}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                error={error}
                signInWithGoogle={signInWithGoogle}
                signInWithEmail={signInWithEmail}
                signUpWithEmail={signUpWithEmail}
                logout={logout}
            />
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
