import React, { useState, useEffect } from "react";
import { X, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "@/redux/api/userApiSlice";
import { setCredentials } from "@/redux/feature/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginModal = ({
  loginModalRef,
  setIsLoginModalOpen,
  setIsSignUpModalOpen,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const userInfo = useSelector((state) => state.auth.userInfo);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      console.log(res);
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      setIsLoginModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleForgotPassword = () => {
    // Implement forgot password functionality
    console.log("Forgot password clicked");
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center p-4">
      <div
        ref={loginModalRef}
        className="bg-background rounded-lg shadow-lg w-full max-w-md border animate-in fade-in-50 duration-300"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Login</h2>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="rounded-full h-8 w-8 inline-flex items-center justify-center hover:bg-muted"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
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
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                htmlFor="remember"
                className="text-sm text-muted-foreground"
              >
                Remember me
              </label>
            </div>
            <Button
              variant="link"
              className="p-0 h-auto text-sm font-medium"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </Button>
          </div>
          <Button type="submit" className="w-full" disabled={isLoginLoading}>
            Login
          </Button>
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => {
                setIsLoginModalOpen(false);
                setIsSignUpModalOpen(true);
              }}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
