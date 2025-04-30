import { Lexend } from "next/font/google";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ToastProvider from "./components/ToastProvider";

// Styles
import "./globals.css";

const lexend = Lexend({ subsets: ["latin"] });

export const metadata = {
    title: "Parking Lot Management",
    description: "Modern parking lot management system",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${lexend.className} antialiased min-h-screen flex flex-col`}>
                <ToastProvider />
                <Header />
                <div>{children}</div>
                <Footer />
            </body>
        </html>
    );
}
