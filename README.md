Gaiyas
======

----

:memo: This is fork version for Firefox

- Original: <https://github.com/syon/gaiyas>

-----

外野たち ― はてなブックマークのコメントを表示

[Gaiyas \- Chrome ウェブストア](https://chrome.google.com/webstore/detail/gaiyas/jgmegliekbljpigaoklckkgbjlnboldh)

![Gaiyas](./creative/gaiyas_screen.png)


## Development

```
yarn start
```

## Dist

```
yarn dist
```

## Publish

Get JWT https://addons.mozilla.org/ja/developers/addon/api/key/

```
yarn dist
cd dist && web-ext sign --api-key $JWT_SECRETE_KEY
```
