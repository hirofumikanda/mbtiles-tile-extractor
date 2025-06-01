# MBTiles Tile Extractor API

このアプリは、クライアントから経緯度範囲を指定してリクエストを受け取り、  
グローバルMBTilesファイルから対象範囲のタイルを抽出し、mb-utilで展開、ZIP圧縮して返却するNode.jsアプリケーションです。

## ディレクトリ構成
project/
├── index.js # サーバー本体
├── package.json # 依存パッケージ
├── data/
│ └── global.mbtiles # 元となる全域のMBTilesファイル（自前で準備）
├── tmp/ # 一時出力用ディレクトリ（自動生成されます）

## 必要なソフトウェア

以下のソフトウェアを事前にインストールしてください：

### Node.js + npm
https://nodejs.org/

### Python + pip
（mb-util 用）

```bash
sudo apt install python3 python3-pip
pip3 install git+https://github.com/mapbox/mbutil.git
```

mb-util が ~/.local/bin にインストールされる場合、PATH に追加：

```bash
echo 'export PATH="$PATH:$HOME/.local/bin"' >> ~/.bashrc
source ~/.bashrc
```

### タイルコピー用ユーティリティ（tilelive）

```bash
npm install
```

### zip コマンド

```bash
sudo apt install zip
```

## 実行方法

1. グローバルMBTilesファイルを `data/global.mbtiles` に配置

2. サーバー起動：

```bash
node index.js
```

## リクエスト送信

```bash
curl "http://localhost:3000/tiles?minLon=139.5&minLat=35.5&maxLon=140&maxLat=36&minZoom=5&maxZoom=7" -o tiles.zip
```

## 応答内容

- 成功時：ZIP形式のタイルセット（ディレクトリ構造：`z/x/y.png` or `z/x/y.pbf`）
- 失敗時：HTTP 500 エラー（ログに詳細出力）

## 注意事項

- 範囲が広すぎると時間がかかるため注意
- `tmp/` 配下に一時ファイルが生成されます（サーバー起動ごとにクリーンアップ）
