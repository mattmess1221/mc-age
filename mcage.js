var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        function get_manifest() {
            return __awaiter(this, void 0, void 0, function* () {
                let res = yield fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json");
                return yield res.json();
            });
        }
        class TimeDelta {
            constructor(time) {
                time /= 24 * 60 * 60 * 1000;
                this.years = Math.floor(time / 365.25);
                time %= 365.25;
                this.months = Math.floor(time / 30.5);
                time %= 30.5;
                this.days = Math.floor(time);
            }
            toString() {
                let parts = [];
                ["years", "months", "days"].forEach(p => {
                    let value = this[p];
                    let key = p.substr(0, p.length - 1);
                    if (value) {
                        parts.push(`${value} ${key}${value > 1 ? "s" : ""}`);
                    }
                });
                return parts.join(", ");
            }
        }
        const params = new URLSearchParams(window.location.search);
        const filterableProperties = ["id", "type"];
        if (filterableProperties.filter(p => params.has(p)).length === 0) {
            params.set("type", "release");
        }
        const manifest = yield get_manifest();
        let versions = manifest.versions;
        for (const p of filterableProperties) {
            if (params.get(p)) {
                versions = versions.filter(v => params.get(p) === v[p]);
            }
        }
        versions.forEach(version => {
            let delta = Date.now() - Date.parse(version.releaseTime);
            let age = `Minecraft ${version.id} is ${new TimeDelta(delta)} old.`;
            let link = "?id=" + version.id;
            document.body.innerHTML += `<p class="version"><a href="${link}">${age}</a></p>`;
        });
        if (versions.length > 1) {
            document.getElementById("intro").style.display = "initial";
        }
    });
})();
//# sourceMappingURL=mcage.js.map