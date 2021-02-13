// ==UserScript==
// @name         localStorage Manager
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  操作网页 localStorage 的修改
// @author       good guys
// @match        http://*/*
// @match        https://*/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/vue
// ==/UserScript==

(function() {
    let div = document.createElement('div');
    div.id = "LocalStorageScript";
    Vue.component('LockInput',{
        template: `
        <input
            type="text"
            :value="localData"
            @input="lock($event.target.value)"
            style="
             width: 60%;
             border: 1px solid black;
             border-radius: 6px;
             margin-left: 5px;
             outline: 0;"
         ></input>`,
        props: ['lockData'],
        data() {
            return {
                dataType: '',
                localData: this.lockData
            }
        },
        created() {
            this.dataType = Object.prototype.toString.call(this.lockData);
        },
        methods: {
            lock(initValue) {
                if(this.dataType == '[object Number]') {
                    if(initValue == '') return;
                    this.localData = parseInt(initValue);
                    this.$emit('updatavalue',this.localData);
                }
                else if(this.dataType == '[object Boolean]') {
                    this.localData = (initValue == 'true') ? true : false;
                    this.$emit('updatavalue',this.localData);
                }
                else  { this.localData = initValue; this.$emit('updatavalue',this.localData); }
            }
        }
    })
    Vue.component('LocalStorageOperate',{
        template: `
        <div style="position: fixed;
                    top: 0;
                    right: 0;
                    height: 100%;
                    display: flex;"
        >
            <div
                id="resize"
                style="
                    width: 10px;
                    height:100%;
                    cursor: w-resize;"
            ></div>
            <div id="container"
                style="
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: row-reverse;
                    align-content: flex-start;
                    border-left: 4px solid black;
                    border-top-left-radius: 2vh;
                    border-bottom-left-radius: 2vh;
                    box-shadow: 0 0 24px 10px rgba(0, 0, 0, 0.2);
                ">
                <div style="width: 100%;">
                    <list
                        :list-contain="Data"
                        style="margin-top: 20px;"
                    ></list>
                </div>
                <button
                    style="
                        background-color: #ffffff;
                        margin-right: 1vh;
                        border: 0.5vh solid black;
                        border-radius: 2vh;
                        font-size: 2vh;
                        width: 20%;
                        height: 5%;
                        outline: 0;
                    "
                    @click="writeLocalStorage"
                >修改</button>
            </div>
        </div>
        `,
        data() {
            return {
                Data: {}
            }
        },
        created() {
            for(let i = 0; i < localStorage.length; i++) {
                this.$set(this.Data,localStorage.key(i),JSON.parse(localStorage.getItem(localStorage.key(i))));
                console.log(JSON.parse(localStorage.getItem(localStorage.key(i))));
            }
        },
        mounted() {
            let resize = document.getElementById("resize");
            var container = document.getElementById("container");
            resize.onmousedown = function(e){
                document.onmousemove = function(e){
                    container.style.width = window.innerWidth - e.clientX + "px";
                }
                document.onmouseup = function(e){
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
            }
        },
        methods: {
            writeLocalStorage() {
                Object.keys(this.Data).forEach((value) => {
                    localStorage.setItem(value,JSON.stringify(this.Data[value]));
                })
            },
            adjustUserWidth() {
                document.onmousemove = (e) => {
                    e.preventDefault();
                    console.log(e.clientX);
                }
            }
        },
        components: {
            list: {
                template: `
                <div>
                 <div v-if="listContainType">
                 <div v-for="(item,index) in listContain" :key="index" >
                    <div style="margin-bottom: 10px; margin-left: 5%; display: flex; justify-content: flex-start;">
                        {{ index }}
                        <lock-input
                            :lock-data="listContain[index]"
                            @updatavalue="data =>{ listContain[index] = data }"
                        ></lock-input>
                        <button
                            v-if="itemType(item)"
                            @click="openData(index)"
                            style="
                            border: 1px solid black;
                            border-radius: 6px;
                            background-color: #ffffff;
                            outline: 0;
                            margin-left: 5px;
                        ">
                        {{ ArrayJudge(item) }}
                        </button>
                    </div>
                    <div v-if="flag == index">
                        <div v-if="itemType(item)" style="margin-left: 5%;">
                            <list :list-contain="item"></list>
                        </div>
                    </div>
                 </div>
                 </div>
                 <div v-else>
                    <div v-for="(value,name,index) in listContain" :key="index" >
                        <div style="margin-bottom: 10px; margin-left: 5%; display: flex; justify-content: flex-start;">
                            {{ name }}
                            <lock-input
                                :lock-data="listContain[name]"
                                @updatavalue="data =>{ listContain[name] = data }"
                            ></lock-input>
                            <button
                                v-if="itemType(value)"
                                @click="openData(index)"
                                style="
                                border: 1px solid black;
                                border-radius: 6px;
                                background-color: #ffffff;
                                outline: 0;
                                margin-left: 5px;
                            ">
                            {{ ArrayJudge(value) }}
                            </button>
                        </div>
                        <div v-if="flag == index">
                            <div v-if="itemType(value)" style="margin-left: 5%;">
                                <list :list-contain="value"></list>
                            </div>
                        </div>
                    </div>
                 </div>
                </div>
                `,
                name: 'list',
                props: ['listContain'],
                data() {
                    return {
                        flag: -999
                    }
                },
                created() {
                },
                methods: {
                    itemType(item) {
                        if(item instanceof Array || item instanceof Object) return true;
                        else return false;
                    },
                    ArrayJudge(item) {
                        if(this.itemType(item)) {
                            if(item instanceof Array)
                                return 'Array';
                            else if(item instanceof Object)
                                return 'Object';
                        }
                    },
                    fillItem(item) {
                        if(this.itemType(item)) {
                            if(this.ArrayJudge(item) == 'Array')
                                return item;
                            else return JSON.stringify(item);
                        }
                        else return item;
                    },
                    openData(index) {
                        this.flag = (index == this.flag) ? index + this.listContain.length : index;
                    }
                },
                computed: {
                    listContainType() {
                        if(this.listContain instanceof Array)
                            return true;
                        else return false;
                    }
                }
            }
        },
    
    });
    let test = document.createElement('local-storage-operate');
    div.appendChild(test);
    document.body.appendChild(div);
    let app = new Vue({
        el: "#LocalStorageScript",
    });
    })();