import React from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  gender: 'M' | 'F';
}

export enum AppScreen {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD'
}

export interface MFEConfig {
  id: string;
  title: string;
  bgColor: string;
  // Fix: Imported React to use React.ReactNode as a type
  icon: React.ReactNode;
  url: string; // URL onde o micro front-end estaria hospedado
}