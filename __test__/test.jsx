import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import App from "../../../src/StudyRecording/src/App";
import {describe, test, expect} from "@jest/globals";

describe('動作テスト', () => {
    test('タイトルが表示されていること', async () => {
        render(React.createElement(App));
        const textElement = await screen.findByText('学習記録アプリ');
        expect(textElement).toBeInTheDocument();
    });
});