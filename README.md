spanner practice
---

# Requirement
* node v8+
* gcloud command
* yarn
* direnv

# How to Use
1. gcloudのセットアップ
  - `$ gcloud auth login`
  - `$ gcloud beta auth application-default login`
2. Spannerの作成
  - `./spanner_ddl.txt` を参考に適宜
3. .envrcの記述
  - `$ mv .envrc.org .envrc`
  - 適宜 `.envrc` を編集
4. モジュールのインストール
  - `$ yarn install`
5. 動作確認
  - `$ yarn run start`
6. デプロイ
  - `$ yarn run deploy`
