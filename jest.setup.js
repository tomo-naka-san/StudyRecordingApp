import '@testing-library/jest-dom';
import {jest} from "@jest/globals";

jest.mock('./src/db/supabaseClient', () => {
  return {
    supabase: {
      from: jest.fn(() => ({
        select: jest.fn(() => Promise.resolve({ data: [], error: null })),
        insert: jest.fn(() => Promise.resolve({ data: [], error: null })),
        // 他に使っている関数（update, deleteなど）があればここに追加できます
      })),
    },
  };
});