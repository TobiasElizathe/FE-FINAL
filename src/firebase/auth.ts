import{
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

export const createUser = async (email: string, password: string) => 
    createUserWithEmailAndPassword(auth, email, password);

export const signInUser = async (email: string, password: string) => 
    signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);