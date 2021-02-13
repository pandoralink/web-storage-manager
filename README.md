# web-storage-manager
管理你的 chrome 的 web storage 数据

由于 chrome 的 web storage 里的数据全部是以字符串的形式存储，当存储数据到了一定的大小，就很难修改（其实可以用indexedDB）

使用这个脚本可以将 web storage 里的数据像 Object 一样展开，然后展开的同时修改

## 注意
* 这个脚本需要搭配油猴脚本(Tampermonkey)使用，那个JS文件就是，另一个`LocalStorageManager.html`文件是它的demo
* 为了防止在修改的过程中，input 自动将初始数据类型修改成 String 类型，我对 input 元素进行了封装，它会锁定 web storage 的变量值初始类型，比如某个 value 一开始的数据类型是 Number 型，那么你在脚本里修改的时候始终会是 Number 型

# END