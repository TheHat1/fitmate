import supabase from "./supabase"

export default async function uploadUserPFP(file, setLoading) {
    try {
        setLoading(true)

        const { data: data1, error } = await supabase.auth.getUser()

        const { data: listData, error: listError } = await supabase.storage.from("fitmate_bucket").list("user_pfps/" + data1.user.id)

        if (listData.length > 0) {
            const { } = await supabase.storage.from('fitmate_bucket').remove(['user_pfps/' + data1.user.id + '/' + listData[0].name])
        }

        const filePath = "user_pfps/" + data1.user.id + '/' + file.name.replaceAll(/[^\w.-]/g, "")

        const { data, error: uploadError } = await supabase
            .storage
            .from('fitmate_bucket')
            .upload(filePath, file, {
                upsert: true,
                contentType: file.type
            })

        localStorage.removeItem("img_cache_" + data1.user.id)
        
        setLoading(false)
        
        if(uploadError) alert(uploadError.message)

    } catch (err) {
        console.error(err.mesage)
    }
}