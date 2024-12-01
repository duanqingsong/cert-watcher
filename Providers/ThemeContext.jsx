'use client'
import React, { createContext, useState, useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes"
 
export const ThemeContext = createContext();

export const ThemeProvider = ({ children,...props }) => {

  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
};