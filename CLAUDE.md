# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際にClaude Code (claude.ai/code) にガイダンスを提供します。

## プロジェクト概要

Next.js 15、TypeScript、TailwindCSSを使用してテスト駆動開発（TDD）の原則に従って構築されたTODOアプリケーションです。単体テストとE2Eテストの両方を含む包括的なテストを実装しています。

## 開発コマンド

**コア開発:**
- `npm run dev` - Turbopackを使用した開発サーバー起動 (http://localhost:3000)
- `npm run build` - プロダクション用アプリケーションをビルド
- `npm run start` - プロダクションサーバー起動
- `npm run lint` - ESLintを実行

**テスト:**
- `npm test` - 単体テストを実行（Vitest）
- `npm run test:watch` - ウォッチモードで単体テストを実行
- `npm run test:ui` - UIモードで単体テストを実行
- `npm run test:e2e` - E2Eテストを実行（Playwright）
- `npm run test:e2e:ui` - UIモードでE2Eテストを実行

## テストアーキテクチャ

プロジェクトでは双方向テストアプローチを使用しています：

**単体テスト（Vitest + Testing Library）:**
- `src/components/__tests__/` と `src/app/__tests__/` に配置
- 個々のコンポーネントとコンポーネント間の統合をテスト
- コンポーネントテストに `@testing-library/react` を使用
- `vitest.config.ts` でjsdom環境を設定
- `src/test/setup.ts` でテストセットアップ

**E2Eテスト（Playwright）:**
- `e2e/` ディレクトリに配置
- ブラウザでの完全なユーザーワークフローをテスト
- `playwright.config.ts` で設定
- テスト用に開発サーバーを自動起動

**重要:** E2Eテストは `exclude: ['**/e2e/**']` によりVitestから除外され、テストフレームワーク間の競合を防いでいます。

## コードアーキテクチャ

**コンポーネント構造:**
- `AddTodo` - 新しいTODO作成用のフォームコンポーネント
- `TodoItem` - 個別のTODO表示と切り替え/削除機能を持つコンポーネント
- `TodoList` - TODOアイテムまたは空の状態を表示するコンテナコンポーネント
- `src/app/page.tsx` のメインアプリが状態管理とコンポーネント調整を担当

**データフロー:**
- メインページコンポーネントでReactの `useState` を使用した状態管理
- TODO操作（追加/切り替え/削除）はpropsとして下位に渡される
- 一意のTODO ID生成に `crypto.randomUUID()` を使用

**型システム:**
- `src/types/todo.ts` でコア型を定義
- `Todo` インターフェース: `{ id: string, text: string, completed: boolean, createdAt: Date }`
- 将来のフィルタリング機能用の `TodoFilter` 型

**パスエイリアス:**
- `@/` が `src/` ディレクトリにマップ（`vitest.config.ts` と `tsconfig.json` の両方で設定）

## 主要なテストパターン

**コンポーネントテスト:**
- propsインターフェースとユーザーインタラクションを常にテスト
- Vitestの `vi.fn()` でコールバック関数をモック
- 成功操作とエッジケース（空入力、空白文字）の両方をテスト
- 視覚的状態変化（CSSクラス、チェックボックス状態）を検証

**E2Eテスト:**
- ページロードからタスク完了まで完全なユーザーワークフローをテスト
- フォーム送信、状態永続化、複数アイテムインタラクションを検証
- Playwrightの自動待機と組み込みアサーションを使用