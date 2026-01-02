import React from "react";
import { Button } from "./button";
import Link from "next/link";
import { Home } from "lucide-react";

const BackToHome = () => {
  return (
    <Link href="/" className="">
      <Button
        type="button"
        variant="outline"
        className="flex gap-2 justify-center items-center w-full border-gold/20 hover:bg-gold/10 bg-transparent mt-4"
      >
        Back to Home <Home className="w-4 " />
      </Button>
    </Link>
  );
};

export default BackToHome;
