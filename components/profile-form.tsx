"use client";

import type React from "react";
import { useState, useEffect, useCallback, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Edit,
  User,
  Mail,
  Phone,
  MapPin,
  X,
  Camera,
  LogOut,
  Check,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SignOutButton } from "./sign-out-button";

interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  pincode: string | null;
}

interface ProfileFormProps {
  profile: Profile | null;
  userEmail: string;
  userImage?: string | null;
  onSignOut?: () => void;
}

export function ProfileForm({
  profile,
  userEmail,
  userImage,
}: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [city, setCity] = useState(profile?.city || "");
  const [pincode, setPincode] = useState(profile?.pincode || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!profile) return;

    setFullName(profile.full_name || "");
    setPhone(profile.phone || "");
    setAddress(profile.address || "");
    setCity(profile.city || "");
    setPincode(profile.pincode || "");
  }, [profile]);

  const handleSubmit = useCallback(async () => {
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          full_name: fullName,
          phone,
          address,
          city,
          pincode,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        setIsEditing(false);
        setSuccess(null);
      }, 2000);

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [fullName, phone, address, city, pincode, router]);

  const handleCancel = useCallback(() => {
    if (!profile) return;

    setFullName(profile.full_name || "");
    setPhone(profile.phone || "");
    setAddress(profile.address || "");
    setCity(profile.city || "");
    setPincode(profile.pincode || "");
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  }, [profile]);

  const InfoField = memo(function InfoField({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-transparent hover:border-muted transition-all">
        <div className="shrink-0 w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-sm font-medium text-foreground wrap-break-words">
            {value || (
              <span className="text-muted-foreground/60 italic">Not set</span>
            )}
          </p>
        </div>
      </div>
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Mobile-First Header Section */}
        <div className="relative">
          {/* Gradient Background */}
          <div className="h-40 sm:h-48 bg-linear-to-br from-yellow-400 via-yellow-500 to-yellow-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>

          {/* Profile Content Container */}
          <div className="px-4 sm:px-6 pb-4">
            <div className="flex flex-col items-center -mt-20 sm:-mt-24 space-y-4">
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-background bg-linear-to-br from-yellow-400 to-yellow-600 flex items-center justify-center overflow-hidden shadow-2xl">
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={fullName || "User"}
                      className="object-cover"
                      width={160}
                      height={160}
                    />
                  ) : (
                    <User className="w-16 h-16 sm:w-20 sm:h-20 text-black/80" />
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="text-center space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {fullName || "User Profile"}
                </h1>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
              </div>

              {/* Action Buttons */}
              {!isEditing && (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto pt-2">
                  <Button
                    onClick={() => setIsEditing(true)}
                    size="lg"
                    className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 pb-6 space-y-4">
          {/* Alert Messages - Mobile Optimized */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border-2 border-destructive/20 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border-2 border-green-500/20 animate-in slide-in-from-top-2">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-green-500">{success}</p>
            </div>
          )}

          {/* Profile Details Card */}
          <Card className="shadow-lg border-2">
            <CardHeader className="border-b bg-muted/30 space-y-2 pb-4">
              <CardTitle className="text-xl sm:text-2xl">
                {isEditing ? "Edit Profile" : "Profile Details"}
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isEditing
                  ? "Update your personal information and delivery details"
                  : "Manage your account settings and preferences"}
              </p>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              {!isEditing ? (
                /* View Mode - Mobile First */
                <div className="space-y-3">
                  <InfoField icon={User} label="Full Name" value={fullName} />
                  <InfoField
                    icon={Mail}
                    label="Email Address"
                    value={userEmail}
                  />
                  <InfoField
                    icon={Phone}
                    label="Phone Number"
                    value={phone || ""}
                  />
                  <InfoField icon={MapPin} label="City" value={city || ""} />
                  <InfoField
                    icon={MapPin}
                    label="Delivery Address"
                    value={
                      address
                        ? `${address}${city ? `, ${city}` : ""}${
                            pincode ? ` - ${pincode}` : ""
                          }`
                        : ""
                    }
                  />
                </div>
              ) : (
                /* Edit Mode - Mobile First */
                <div className="space-y-5">
                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="text-sm font-semibold flex items-center gap-1"
                      >
                        Full Name
                        <span className="text-destructive text-base">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="h-12 text-base"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={userEmail}
                        disabled
                        className="h-12 text-base bg-muted cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="h-12 text-base"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="address"
                        className="text-sm font-semibold"
                      >
                        Address
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House no., Street address, apartment, suite, etc."
                        className="h-12 text-base"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-semibold">
                          City
                        </Label>
                        <Input
                          id="city"
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Mumbai"
                          className="h-12 text-base"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="pincode"
                          className="text-sm font-semibold"
                        >
                          Pincode
                        </Label>
                        <Input
                          id="pincode"
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="400001"
                          className="h-12 text-base"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Mobile First at Bottom */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t-2">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="lg"
                      disabled={isLoading}
                      className="w-full sm:flex-1 h-12 border-2 font-semibold"
                    >
                      <X className="mr-2 h-5 w-5" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      size="lg"
                      disabled={isLoading}
                      className="w-full sm:flex-1 h-12 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-5 w-5" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
              <div className="mt-4">
                <SignOutButton className="h-12 border-2 font-semibold hover:bg-destructive hover:text-destructive-foreground transition-all" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
