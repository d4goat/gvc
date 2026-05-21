import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

const AppLayout = ({children}: { children: ReactNode }) => (
    <>
    <Header/>
    {children}
    <Footer/>
    </>
)

export default AppLayout