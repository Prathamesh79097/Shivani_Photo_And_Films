import { io } from 'socket.io-client';
import { API_BASE } from './data/constants';

// Initialize socket connection using the same base URL as API
export const socket = io(API_BASE);
