(async function () {
    interface Manifest {
        latest: {
            release: string;
            snapshot: string;
        };
        versions: {
            id: string
            type: string
            url: string
            time: string
            releaseTime: string
        }[];
    }

    async function get_manifest(): Promise<Manifest> {
        let res = await fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json");
        return await res.json();
    }

    class TimeDelta {
        years: number;
        months: number;
        days: number;

        constructor(time: number) {
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

    const manifest = await get_manifest();

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
})();
