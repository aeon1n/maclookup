"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let timer;
let input = document.querySelector("input");
let successIcon = document.querySelector(".success");
let errorIcon = document.querySelector(".error");
let ul = document.querySelector("ul");
let loading = document.querySelector(".loading");
input.addEventListener("input", (e) => {
    let i = e.target;
    clearTimeout(timer);
    timer = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
        if (macRegex.test(i.value.trim())) {
            errorIcon.classList.add("hidden");
            successIcon.classList.remove("hidden");
            try {
                let res = yield requestMac(i.value.trim());
                ul.innerHTML = `<li><strong>MacPrefix:</strong> ${res.macPrefix}</li>
        <li><strong>VendorName:</strong> ${res.vendorName}</li>
        <li><strong>Private:</strong> ${res.private}</li>
        <li><strong>BlockType:</strong> ${res.blockType}</li>
        <li><strong>LastUpdated:</strong> ${res.lastUpdated}</li>`;
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            successIcon.classList.add("hidden");
            errorIcon.classList.remove("hidden");
            ul.innerHTML = "Enter valid Mac Address";
            console.log("Invalid MAC address");
        }
    }), 800);
});
function requestMac(address) {
    return __awaiter(this, void 0, void 0, function* () {
        loading.classList.remove("hidden");
        const response = yield fetch(`https://macfunction.azurewebsites.net/api/mac?address=${address}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = yield response.json();
        loading.classList.add("hidden");
        return {
            macPrefix: data.macPrefix,
            vendorName: data.vendorName,
            private: data.private,
            blockType: data.blockType,
            lastUpdated: data.lastUpdated,
        };
    });
}
