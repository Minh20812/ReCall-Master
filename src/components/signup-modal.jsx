import { useState, useRef } from "react";
import { X, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnClickOutside } from "../hooks/use-click-outside";
import { useRegisterMutation } from "@/redux/api/userApiSlice";

const SignUpModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  const modalRef = useRef(null);

  // Close modal when clicking outside
  useOnClickOutside(modalRef, onClose, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    console.log("Registering:", username, email, password);
    try {
      const res = await register({
        username,
        email,
        password,
      }).unwrap();

      console.log("Registration successful:", res);
      onClose();

      // Reset form
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center p-4">
      <div
        ref={modalRef}
        className="bg-background rounded-lg shadow-lg w-full max-w-md border animate-in fade-in-50 duration-300"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Sign Up</h2>
          <button
            onClick={onClose}
            className="rounded-full h-8 w-8 inline-flex items-center justify-center hover:bg-muted"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <form onSubmit={submitHandler} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="pl-10"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="pl-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              required
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              I agree to the{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={isRegistering}>
            {isRegistering ? "Creating Account..." : "Create Account"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={onSwitchToLogin}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;
