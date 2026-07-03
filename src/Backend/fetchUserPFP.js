import supabase from "./supabase"

export default async function fetchUserPFP() {
    try {
        const { data: data1, error } = await supabase.auth.getUser()

        const cacheData = localStorage.getItem("img_cache_" + data1.user.id)

        if (cacheData) {
            const { url, expiry } = JSON.parse(cacheData)
            if (Date.now() < expiry) {
                return url
            }
        }

        const { data: listData, error: listError } = await supabase.storage.from("fitmate_bucket").list("user_pfps/" + data1.user.id)

        if (listData.length > 0) {
            const { data: PFPdata, error: PFPerror } = await supabase.
                storage.
                from('fitmate_bucket').
                createSignedUrl("user_pfps/" + data1.user.id + "/" + listData[0].name, 60 * 60 * 24)

            localStorage.setItem("img_cache_" + data1.user.id, JSON.stringify({
                url: PFPdata.signedUrl,
                expiry: Date.now() + 60 * 60 * 24 * 1000
            }))

            return PFPdata.signedUrl

        } else {
            return "/Icons/user.png"
        }

    } catch (err) {
        console.error(err.mesage)
    }
}