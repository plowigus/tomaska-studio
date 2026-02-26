import React from "react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-black text-white py-4 flex justify-center items-center">
            <p className="text-sm font-light tracking-wide">
                Tomaska Studio {currentYear}
            </p>
        </footer>
    );
}
