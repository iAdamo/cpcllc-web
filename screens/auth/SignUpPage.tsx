"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { register, sendCode } from "@/axios/auth";

interface PasswordRequirements {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

interface ValidationErrors {
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone: string): boolean => {
  const re = /^[\d\s\-\+\(\)]{10,}$/;
  return re.test(phone);
};

const checkPasswordRequirements = (password: string): PasswordRequirements => ({
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /\d/.test(password),
  special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
});

const calculatePasswordStrength = (
  requirements: PasswordRequirements
): { score: number; label: string; color: string } => {
  const metRequirements = Object.values(requirements).filter(Boolean).length;
  if (metRequirements === 0) return { score: 0, label: "", color: "" };
  if (metRequirements <= 2)
    return {
      score: 33,
      label: "Weak",
      color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30",
    };
  if (metRequirements <= 3)
    return {
      score: 66,
      label: "Medium",
      color:
        "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30",
    };
  return {
    score: 100,
    label: "Strong",
    color:
      "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  };
};

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState({
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
  });

  const passwordRequirements = useMemo(
    () => checkPasswordRequirements(password),
    [password]
  );
  const passwordStrength = useMemo(
    () => calculatePasswordStrength(passwordRequirements),
    [passwordRequirements]
  );
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  // Memoized form validation check (doesn't update state)
  const isFormValid = useMemo(() => {
    const emailValid = email && validateEmail(email);
    const phoneValid = phoneNumber && validatePhone(phoneNumber);
    const passwordValid =
      password && Object.values(passwordRequirements).every(Boolean);
    const confirmPasswordValid = confirmPassword && passwordsMatch;

    return emailValid && phoneValid && passwordValid && confirmPasswordValid;
  }, [
    email,
    phoneNumber,
    password,
    confirmPassword,
    passwordRequirements,
    passwordsMatch,
  ]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    setLoading(true);
    try {
      await register({ email, phoneNumber, password });
      // Fire a verification code so the verify-email page has something to use.
      await sendCode({ email }).catch(() => {});
      router.replace(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setErrors({
        email:
          err?.response?.data?.message ??
          err?.message ??
          "Could not create your account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Create account
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Join our platform and start connecting with services
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-7 shadow-sm">
          <form onSubmit={onSubmit} className="space-y-5">
            {/* General Error Alert */}
            {errors.email && !validateEmail(email) && touched.email && (
              <div className="flex gap-3 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg">
                <AlertCircle
                  size={18}
                  className="text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  {errors.email}
                </p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="text-sm font-semibold text-slate-900 dark:text-white block mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none text-sm
                  ${
                    touched.email && email && !validateEmail(email)
                      ? "border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/20"
                      : touched.email && email && validateEmail(email)
                      ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20"
                      : "border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                  }
                  focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}
                placeholder="you@example.com"
              />
              {touched.email && email && validateEmail(email) && (
                <div className="flex gap-2 mt-2 text-xs text-green-600 dark:text-green-400">
                  <CheckCircle2 size={14} />
                  Valid email
                </div>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="text-sm font-semibold text-slate-900 dark:text-white block mb-2"
              >
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onBlur={() => handleBlur("phone")}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none text-sm
                  ${
                    touched.phone && phoneNumber && !validatePhone(phoneNumber)
                      ? "border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/20"
                      : touched.phone &&
                        phoneNumber &&
                        validatePhone(phoneNumber)
                      ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20"
                      : "border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                  }
                  focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}
                placeholder="+1 (555) 123-4567"
              />
              {touched.phone && phoneNumber && !validatePhone(phoneNumber) && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-2">
                  {errors.phone}
                </p>
              )}
              {touched.phone && phoneNumber && validatePhone(phoneNumber) && (
                <div className="flex gap-2 mt-2 text-xs text-green-600 dark:text-green-400">
                  <CheckCircle2 size={14} />
                  Valid phone number
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="text-sm font-semibold text-slate-900 dark:text-white block mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all outline-none text-sm
                    ${
                      password &&
                      !Object.values(passwordRequirements).every(Boolean)
                        ? "border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/20"
                        : password &&
                          Object.values(passwordRequirements).every(Boolean)
                        ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20"
                        : "border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                    }
                    focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-3 space-y-3">
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score <= 33
                            ? "w-1/3 bg-red-500"
                            : passwordStrength.score <= 66
                            ? "w-2/3 bg-amber-500"
                            : "w-full bg-green-500"
                        }`}
                      />
                    </div>
                    {passwordStrength.label && (
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${passwordStrength.color}`}
                      >
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>

                  {/* Requirements Checklist */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      Password requirements:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className={`flex gap-2 items-center text-xs ${
                          passwordRequirements.length
                            ? "text-green-600 dark:text-green-400"
                            : "text-slate-500 dark:text-slate-500"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                            passwordRequirements.length
                              ? "bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-700"
                              : "border-slate-300 dark:border-slate-700"
                          }`}
                        >
                          {passwordRequirements.length && (
                            <CheckCircle2 size={12} />
                          )}
                        </div>
                        At least 8 characters
                      </div>
                      <div
                        className={`flex gap-2 items-center text-xs ${
                          passwordRequirements.uppercase
                            ? "text-green-600 dark:text-green-400"
                            : "text-slate-500 dark:text-slate-500"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                            passwordRequirements.uppercase
                              ? "bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-700"
                              : "border-slate-300 dark:border-slate-700"
                          }`}
                        >
                          {passwordRequirements.uppercase && (
                            <CheckCircle2 size={12} />
                          )}
                        </div>
                        One uppercase (A-Z)
                      </div>
                      <div
                        className={`flex gap-2 items-center text-xs ${
                          passwordRequirements.lowercase
                            ? "text-green-600 dark:text-green-400"
                            : "text-slate-500 dark:text-slate-500"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                            passwordRequirements.lowercase
                              ? "bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-700"
                              : "border-slate-300 dark:border-slate-700"
                          }`}
                        >
                          {passwordRequirements.lowercase && (
                            <CheckCircle2 size={12} />
                          )}
                        </div>
                        One lowercase (a-z)
                      </div>
                      <div
                        className={`flex gap-2 items-center text-xs ${
                          passwordRequirements.number
                            ? "text-green-600 dark:text-green-400"
                            : "text-slate-500 dark:text-slate-500"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                            passwordRequirements.number
                              ? "bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-700"
                              : "border-slate-300 dark:border-slate-700"
                          }`}
                        >
                          {passwordRequirements.number && (
                            <CheckCircle2 size={12} />
                          )}
                        </div>
                        One number (0-9)
                      </div>
                      <div
                        className={`flex gap-2 items-center text-xs col-span-2 ${
                          passwordRequirements.special
                            ? "text-green-600 dark:text-green-400"
                            : "text-slate-500 dark:text-slate-500"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center border flex-shrink-0 ${
                            passwordRequirements.special
                              ? "bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-700"
                              : "border-slate-300 dark:border-slate-700"
                          }`}
                        >
                          {passwordRequirements.special && (
                            <CheckCircle2 size={12} />
                          )}
                        </div>
                        One special character (!@#$%^&*)
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            {password && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-slate-900 dark:text-white block mb-2"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => handleBlur("confirmPassword")}
                    className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all outline-none text-sm
                      ${
                        confirmPassword && !passwordsMatch
                          ? "border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/20"
                          : confirmPassword && passwordsMatch
                          ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20"
                          : "border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                      }
                      focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <div className="flex gap-2 mt-2 text-xs text-rose-600 dark:text-rose-400">
                    <AlertCircle size={14} />
                    Passwords do not match
                  </div>
                )}
                {confirmPassword && passwordsMatch && (
                  <div className="flex gap-2 mt-2 text-xs text-green-600 dark:text-green-400">
                    <CheckCircle2 size={14} />
                    Passwords match
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full h-12 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 mt-6
                ${
                  loading || !isFormValid
                    ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 active:scale-95"
                }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>

            {/* Sign In Link */}
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* Footer Text */}
        <p className="text-[11px] text-slate-500 dark:text-slate-500 text-center mt-5 leading-relaxed">
          By signing up you agree to our{" "}
          <Link
            href="#"
            className="text-slate-700 dark:text-slate-400 hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="text-slate-700 dark:text-slate-400 hover:underline"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
