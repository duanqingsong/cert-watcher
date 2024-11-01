'use client'
import React, { createContext, useState } from "react";

export const ThemeContext=createContext()

export const ThemeProvider=({children})=>{
  
  const [theme,setTheme]=useState('light')
  const toggleTheme=()=>{
    setTheme((pre)=>pre==='light'?'dark':'light')
  }
  return (
  <ThemeContext.Provider value={{theme,toggleTheme}}>
    {/* 这里添加了两个样式 theme light或dark */}
    {/* 用法，下面的语句。在组件中通过当前theme及切换方法
        const {theme,toggleTheme}=useContext(ThemeContext);
        //切换样式，添加动画
        .theme{
          transition 1s all ease;
        }
    */}
    <div className={`theme ${theme} w-full h-screen`}>
      {children}
    </div>
  </ThemeContext.Provider>)
}