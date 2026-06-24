import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../src/App";
import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import userEvent from "@testing-library/user-event";

jest.mock("../src/db/supabaseClient", () => ({
    supabase: {
        from: jest.fn()
    },
}));

import { supabase } from "../src/db/supabaseClient"; 

describe('動作テスト', () => {
    let mockSelect;
    let mockInsert;
    let mockDelete;

    beforeEach(() => {
        jest.clearAllMocks();

        mockSelect = jest.fn()
            .mockResolvedValueOnce({ data: [], error: null }) // 初回起動時
            .mockResolvedValueOnce({ data: [{ id: 1, title: "テストコードから入力", time: 100 }], error: null })
            .mockResolvedValueOnce({ data: [], error: null }); // 登録後

        mockInsert = jest.fn().mockResolvedValue({ error: null });

        mockDelete = jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ error: null})
        });

        supabase.from.mockImplementation((table) => {
            if (table === "study-records") {
                return {
                    select: mockSelect,
                    insert: mockInsert,
                    delete: mockDelete,
                };
            }
            return {
                select: jest.fn().mockResolvedValue({ data: [], error: null }),
                insert: jest.fn().mockResolvedValue({ error: null }),
                delete: jest.fn().mockReturnValue(() => ({
                    eq: jest.fn().mockResolvedValue({error: null})
                }))
            };
        });
    });

    test('タイトルが表示されていること', async () => {
        render(<App />);
        const textElement = await screen.findByText('学習記録アプリ');
        expect(textElement).toBeInTheDocument();
    });

    test('フォームに学習内容と時間を入力すると、一覧に表示されること', async () => {
        render(<App />);
        await waitFor(() => {
            expect(screen.queryByText("Loading......")).not.toBeInTheDocument();
        });

        const user         = userEvent.setup();
        const titleInput   = screen.getByPlaceholderText("例 プログラミング");
        const timeInput    = screen.getByPlaceholderText("例 2");
        const submitButton = screen.getByRole("button", { name: "登録" });

        await user.type(titleInput, "テストコードから入力");
        await user.type(timeInput, "100");
        await user.click(submitButton);

        expect(mockInsert).toHaveBeenCalledWith({
            title: "テストコードから入力",
            time: 100
        });

        await waitFor(() => {
            expect(screen.getByText("テストコードから入力")).toBeInTheDocument();
            expect(screen.getByText("100時間")).toBeInTheDocument();
            expect(screen.getByText("総学習時間：100時間")).toBeInTheDocument();
        });
    });

    test("削除ボタンを押すと学習記録が削除される", async () => {
        render(<App />);
        await waitFor(() => {
            expect(screen.queryByText("Loading......")).not.toBeInTheDocument();
        });

        const user         = userEvent.setup();
        const titleInput   = screen.getByPlaceholderText("例 プログラミング");
        const timeInput    = screen.getByPlaceholderText("例 2");
        const submitButton = screen.getByRole("button", {name: "登録"});
        
        await user.type(titleInput, "テストコードから入力");
        await user.type(timeInput, "100");
        await user.click(submitButton);

        expect(mockInsert).toHaveBeenCalledWith({
            title: "テストコードから入力",
            time: 100
        });
        
        await waitFor(() => {
            expect(screen.getByText("テストコードから入力")).toBeInTheDocument();
            expect(screen.getByText("100時間")).toBeInTheDocument();
            expect(screen.getByText("総学習時間：100時間")).toBeInTheDocument();
        });
        
        const deleteButton = screen.getByRole("button", {name: "削除"});
        await user.click(deleteButton);
        expect(mockDelete).toHaveBeenCalled();

        await waitFor(() => {
            expect(screen.getByText("総学習時間：0時間")).toBeInTheDocument();
        });
    });

    test("入力をしないで登録を押すとエラーが表示される", async () => {
        render(<App />);
        await waitFor(() => {
            expect(screen.queryByText("Loading......")).not.toBeInTheDocument();
        });

        const user         = userEvent.setup();
        const submitButton = screen.getByRole("button", {name: "登録"});
        await user.click(submitButton);

        const textElement = await screen.findByText('すべての項目を入力してください。');
        expect(textElement).toBeInTheDocument();
    });
});