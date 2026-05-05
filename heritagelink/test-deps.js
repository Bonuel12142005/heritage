// Test script to check all dependencies
import express from 'express';
import session from 'express-session';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import ejs from 'ejs';

console.log('✅ All dependencies are working correctly!');
console.log('Express:', express);
console.log('Express Session:', session);
console.log('MySQL2:', mysql);
console.log('bcryptjs:', bcrypt);
console.log('EJS:', ejs);
