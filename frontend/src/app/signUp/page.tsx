"use client";

import type React from "react";


import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, User } from "lucide-react";


export default function AuthForms() {

  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [open, setOpen] = useState(false)

 
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
 
  const [signupName, setSignupName] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [signUpTypingError,setsignUpTypingError] = useState("");
  const [signUpPasswordError, setSignUpPasswordError] = useState("");
  const [signupConfirmPasswordError,setsignupConfirmPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setsignUpTypingError("");
    setSignupName(value); 
    
    if (value.length < 8) {
      return setsignUpTypingError("Username must be at least 8 characters long.");
    }
    setSignUpError("");
    
  };

  const handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSignupPassword(value);

    setSignUpPasswordError("");
    setPasswordStrength("");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

    if (!passwordRegex.test(value)) {
      setSignUpPasswordError("Password must contain at least one lowercase letter, one uppercase letter, and one special character!");
    }
    const hasLowercase = /[a-z]/.test(value);
    const hasUppercase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[\W_]/.test(value);

    let strength = 0;
    if (hasLowercase) strength++;
    if (hasUppercase) strength++;
    if (hasNumber) strength++;
    if (hasSpecialChar) strength++;


    if (strength <= 1) {
        setPasswordStrength("Weak");
    }else if (strength === 2) {
        setPasswordStrength("Medium");
    }else if (strength >= 3) {
        setPasswordStrength("Strong");
    }
    setSignUpError("");
    
  };

  const handleConfirmPasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setsignupConfirmPasswordError("");
    setPasswordStrength("");
    setSignupConfirmPassword(value);

    if (signupPassword !== value) {
      return setsignupConfirmPasswordError("Passwords do not match.");
    }
    setSignUpError("");
   
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    
    const form = e.target as HTMLFormElement;
    const loginName = form.loginusername.value; 
    const loginPassword = form.loginpassword.value; 
    
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginName,
          password: loginPassword,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
      
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);

        window.location.href = '/dashboard'; 

      } else {
        setLoginError(data.message || "Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginError("An error occurred while logging in.");
    }
  };
  

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError("");
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    
    if(signupName.length<8){
      setSignUpError("User name should be at least 8 characters");
      return;
    }

    if (!passwordRegex.test(signupPassword)) {
      setSignUpError("Password must contain at least one lowercase letter, one uppercase letter, and one special character!");
      return;
    }
  
    if (signupPassword !== signupConfirmPassword) {
      setSignUpError("Confirm Password must match Password!");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: signupName, password: signupPassword }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setOpen(true);

        setTimeout(() => {
          setOpen(false);
          router.push('/dashboard')
        }, 2000);

      } else {
        setSignUpError(data.message || "Invalid username or password");
      }
    } catch (error) {
      setSignUpError("Error");
    }
  };
  
  
  

  return (
  <>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-lg overflow-hidden relative">
          
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

          <div className="relative p-8">
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight">
                {isLogin ? "Welcome back" : "Create account"}
              </h1>
              <p className="text-muted-foreground mt-2">
                {isLogin
                  ? "Sign in to access your account"
                  : "Sign up to get started with our service"}
              </p>
              <motion.div
                className="h-1 w-12 bg-primary rounded-full mx-auto mt-4"
                layoutId="underline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>

          
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {isLogin ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="loginusername">Username</Label>
                      <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="loginusername"
                          type="text"
                          placeholder="Enter your username here"
                          className="pl-10"
                          value={loginName}
                          onChange={(e) => setLoginName(e.target.value)}
                          required
                        />
                        {signUpError && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                      {signUpError}
                    </div>
                    )}
                    </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="loginpassword">Password</Label>
                        <a
                          href="#"
                          className="text-sm text-primary hover:underline"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="loginpassword"
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-10"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        name="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                          setRememberMe(checked as boolean)
                        }
                      />
                      <Label htmlFor="remember" className="text-sm font-normal">
                        Remember me
                      </Label>
                    </div>
                    <Button type="submit" className="w-full">
                      Log in
                      <motion.div
                        className="ml-2"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </Button>
                    {loginError && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                      {loginError}
                    </div>
                    )}
                  </form>
                  
                ) : (
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="username"
                          type="text"
                          placeholder="Username"
                          className="pl-10"
                          value={signupName} 
                          onChange={(e) => handleUsernameChange(e)}
                          required
                        />
                        {signUpTypingError && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                      {signUpTypingError}
                    </div>
                    )}
                        
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-10"
                          value={signupPassword}
                          onChange={(e) => handlePasswordChange(e)}
                          required
                        />
                        {passwordStrength && (
                            <div className={`mt-2 text-center ${
                                passwordStrength.includes("Strong") ? "text-green-500" :
                                passwordStrength.includes("Medium") ? "text-yellow-500" :
                                "text-red-500"
                            }`}>
                                {passwordStrength}
                            </div>
                        )}

                        {signUpPasswordError && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                      {signUpPasswordError}
                    </div>
                    )}
                        <button
                          type="button"
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-10"
                          value={signupConfirmPassword}
                          onChange={(e) => handleConfirmPasswordChange(e)
                          }
                          required
                        />
                        {signupConfirmPasswordError && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                      {signupConfirmPasswordError}
                    </div>
                    )}
                        <button
                          type="button"
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={!signupName || !signupPassword || !signupConfirmPassword}>
                      Create account
                      <motion.div
                        className="ml-2"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </Button>
                    {signUpError && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                      {signUpError}
                    </div>
                    )}
                    
                  </form>
                )}
              </motion.div>
            </AnimatePresence>

            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="ml-1 text-primary hover:underline focus:outline-none"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>

    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mt-2 text-center ">
                    <p className="text-xl text-green-500">
                     Succesfully Signed Up.
                    </p>
                    <p>Please login in with the given credential</p>
                  </div>
            </div>
            <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 justify-center">
              
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </>
  );
}
