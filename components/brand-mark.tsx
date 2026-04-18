import React from "react";
import Image from "next/image";

const BrandMark = ({ signin }: { signin?: boolean }) => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-18 h-18 bg-primary/15 border border-primary/25 flex items-center justify-center mb-2 rounded-full p-1">
        <Image
          src="/images/logo/beebites_logo_transparentbg.png"
          alt="BeeBites"
          width={160}
          height={48}
          className="object-contain object-left"
        />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
        {signin ? "Welcome back" : "Create account"}
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        {signin
          ? "Sign in to satisfy those late-night cravings"
          : "Join us for late-night cravings"}
      </p>
    </div>
  );
};

export default BrandMark;
