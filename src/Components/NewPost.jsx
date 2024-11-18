import { observable } from "mobx";
import InputBox from "./FormControls/InputBox";
import { observer } from "mobx-react";
import Carousel from "./Carousel";
import { Countries } from "../countries";
import { Categories, getCategoryByCode } from "../categories";
import { supabase } from "../supabase";
import cuid2 from "@paralleldrive/cuid2";
import Loading from "./Loading";
import { getCountryByCode } from "../countries";
import { createCUId } from "../functions";
import Button from "./FormControls/Button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const NewPostState = observable({
    postData: {
        title: "",
        postedBy: "",
        content: "",
        files: [],
        country: Countries[0].code,
        category: Categories[0].code,
    },
    isPosting: false,
    setPostTitle: (title) => NewPostState.postData.title = title,
    setPostedBy: (name) => NewPostState.postData.postedBy = name,
    setPostContent: (content) => NewPostState.postData.content = content,
    setPostFiles: (files) => {
        NewPostState.postData.files = files
    },
    setCountry: (country) => NewPostState.postData.country = country,
    setCategory: (category) => NewPostState.postData.category = category,
    resetData: () => {
        NewPostState.postData = {
            title: "",
            postedBy: "",
            content: "",
            files: [],
            country: Countries[0].code,
            category: Categories[0].code,
        }
    },
    setPostingStatus: (value) => NewPostState.isPosting = value
})

const NewPost = observer(({ addNote }) => {
    const navigate = useNavigate()

    useEffect(()=>{
        document.title = "New Post"
    },[])

    const updateFiles = async (files) => {
        return new Promise((resolve, reject) => {
            if (files.length > 5) {
                return reject("You can post maximum 5 files per post!")
            }
            let filesData = []
            let successItems = []
            for (let i = 0; i < files.length; i++) {
                const FILE = files[i];
                if (!(["image/jpeg", "image/jpg", "image/png", "video/mp4"].includes(FILE.type))) {
                    return reject("Please select an Image or Video file!")
                }
                if ((FILE.size / 1024 / 1024) > 5) {
                    return reject("File size is more than 5 MBs!")
                }
                const HeaderNames = ["image/png", "image/jpeg", "video/mp4", "video/mp4", "video/mp4"]
                const TypesHeader = ["89504e47", "ffd8ff", "6674797069736F6D", "00020667479706", "00018667479706"]

                var blob = files[i];
                var fileReader = new FileReader();
                fileReader.onloadend = function (e) {
                    var arr = (new Uint8Array(e.target.result)).subarray(0, 32);
                    var header = "";
                    for (var j = 0; j < arr.length; j++) {
                        header += arr[j].toString(16);
                    }

                    let included = false;
                    let includedIndex = -1;
                    for (let k = 0; k < TypesHeader.length; k++) {
                        const FIXED_HEADER = TypesHeader[k]
                        if (header.startsWith(FIXED_HEADER)) {
                            included = true;
                            includedIndex = k;
                            break
                        }
                    }
                    if (included !== true) {
                        return reject("Invalid file, you cannot upload any file by changing the extension!")
                    } else {
                        filesData.push({
                            "file": files[i],
                            "type": HeaderNames[includedIndex]
                        })
                        successItems.push(1)
                        if (successItems.length === files.length) {
                            return resolve(filesData)
                        }
                    }
                };
                fileReader.readAsArrayBuffer(blob);
            }
        })
    }

    const uploadFiles = async (FILES) => {
        let uploadedFiles = []
        for (let i = 0; i < FILES.length; i++) {
            const file = FILES[i]['file']
            const fileType = FILES[i]['type']
            const fileId = cuid2.createId() + "-" + cuid2.createId() + "." + file.name.split(".")[file.name.split(".").length - 1]
            const { data, error } = await supabase.storage.from("post-files").upload(
                fileId, file, {
                contentType: fileType,
                cacheControl: '2599999'
            })
            if (error) {
                addNote("Could not post your files, tryagain soon!", "error")
                return
            } else {
                uploadedFiles.push({
                    "type": file.type,
                    "url": supabase.storage.from("post-files").getPublicUrl(data.path).data.publicUrl
                })
            }
        }
        return uploadedFiles
    }

    const ValidateForm = () => {
        let errors = []
        const postData = { ...NewPostState.postData };
        postData.title = postData.title.trim()
        postData.postedBy = postData.postedBy.trim()
        postData.content = postData.content.trim()

        if (postData.title.length < 5 || postData.title.length > 100) {
            errors.push("Value for title must be between 5 to 100 characters!")
        }
        if (postData.postedBy.length > 32) {
            errors.push("Value for name must be between 4 to 32 characters!")
        }
        if (postData.content.length > 2048) {
            errors.push("Value for post content must be between 4 to 2048 characters!")
        }
        if (postData.files.length > 5) {
            errors.push("You cannot post more than 5 Image/Video files in a post!")
        }
        if (!getCategoryByCode(postData.category)) {
            errors.push("Category does not exists in data!")
        }
        if (!getCountryByCode(postData.country)) {
            errors.push("Country does not exists in data!")
        }
        return errors
    }

    const sendPost = async (e) => {
        e.preventDefault()
        NewPostState.setPostingStatus(true)

        const formErrors = ValidateForm()
        if (formErrors.length > 0) {
            formErrors.forEach(err => addNote(err, "error"))
            NewPostState.setPostingStatus(false)
            return
        }

        const filesToUpload = [...NewPostState.postData.files]
        const filesIds = await uploadFiles(filesToUpload)

        let referenceId = ""
        const allowedCharacters = "abcdefghijklmnopqrstuvwxyz0123456789"
        for (let i = 0; i < 8 && i < NewPostState.postData.title.length; i++) {
            if (allowedCharacters.includes(NewPostState.postData.title[i].toLowerCase())) {
                referenceId += NewPostState.postData.title[i].toLowerCase()
            } else {
                referenceId += allowedCharacters[parseInt(Math.random() * allowedCharacters.length)]
            }
        }
        referenceId += "-"
        referenceId += createCUId()

        const { data, error } = await supabase.rpc("new_post", {
            title: NewPostState.postData.title.trim(),
            username: NewPostState.postData.postedBy.trim(),
            content: NewPostState.postData.content.trim(),
            files: filesIds,
            country: NewPostState.postData.country,
            category: NewPostState.postData.category,
            reference_id: referenceId
        })

        if (error) {
            if(error.code === '42501'){
                addNote('To protect the platform we limit the user requests on hour basis, you can tryagain later after an hour!', 'error')
            } else {
                addNote("Your post could not be posted, tryagain soon", "error")
            }
        } else {
            if (data.status === "ok") {
                addNote("Successfully posted your post, check and share.", "success")
                NewPostState.resetData()
                navigate(`/p/${referenceId}`)
            } else {
                addNote("Something went wrong, tryagain soon", "error")
            }
        }
        NewPostState.setPostingStatus(false)
    }

    return (
        <div className="p-5">
            <form className="w-full max-w-xl mx-auto my-10 mx-1" onSubmit={sendPost}>
                <h2 className="text-2xl my-8 text-black dark:text-white">New Post</h2>
                <InputBox
                    inputType={'text'}
                    labelName={'Post title'}
                    maxLength={100} minLength={5}
                    required={true}
                    stateVariable={NewPostState.postData.title} updateData={NewPostState.setPostTitle}
                    fontFamily="font-hand"
                    disabled={NewPostState.isPosting}
                />

                <InputBox
                    inputType={'text'}
                    labelName={'Your name (optional)'}
                    maxLength={32} minLength={4}
                    required={false}
                    stateVariable={NewPostState.postData.postedBy} updateData={NewPostState.setPostedBy}
                    fontFamily="font-hand"
                    disabled={NewPostState.isPosting}
                />

                <InputBox
                    multiLine={true}
                    labelName={'Post content'}
                    maxLength={2048} minLength={4}
                    required={true}
                    stateVariable={NewPostState.postData.content} updateData={NewPostState.setPostContent}
                    disabled={NewPostState.isPosting}
                />

                <InputBox
                    inputType={'file'}
                    labelName={'Image/Video files (if any)'}
                    required={false}
                    fontFamily="font-hand"
                    onChange={e => {
                        updateFiles(e.target.files)
                            .then((files) => {
                                NewPostState.setPostFiles(files)
                            })
                            .catch(error => {
                                addNote(error, "error")
                                e.target.value = ''
                                NewPostState.setPostFiles([])
                            })
                    }}
                    files={NewPostState.postData.files}
                    multiple={true}
                    accept="image/png, image/jpeg, video/mp4"
                    disabled={NewPostState.isPosting}
                />

                {
                    NewPostState.postData.files.length > 0 ?
                        <Carousel
                            posts={[...NewPostState.postData.files].map(file => {
                                return {
                                    postURL: URL.createObjectURL(file.file),
                                    postType: file.type,
                                    name: file.file.name,
                                    size: file.file.size
                                }
                            })}
                        />
                        :
                        []
                }

                <div className="flex flex-col my-10 text-black dark:text-white">
                    <label htmlFor={'country'} className="text-black border border-b-0 p-3 dark:border-white border-neutral-700 dark:text-white">Country specific</label>
                    <select
                        id={'country'}
                        className="font-regular px-2 py-3 border border-neutral-700 text-lg w-full bg-white text-black dark:bg-neutral-800 dark:text-white dark:border-white focus:dark:border-cyan-300 focus:border-neutral-700 focus:outline-none"
                        value={NewPostState.postData.country}
                        onChange={e => NewPostState.setCountry(e.target.value)}
                        disabled={NewPostState.isPosting}
                    >
                        {Countries.map(opt => <option value={opt['code']} key={opt['code']}>{opt['name']}</option>)}
                    </select>
                </div>

                <div className="flex flex-col my-10 text-black dark:text-white">
                    <label htmlFor={'category'} className="text-black border border-b-0 p-3 dark:border-white border-neutral-700 dark:text-white">Category specific</label>
                    <select
                        id={'category'}
                        className="font-regular px-2 py-3 border border-neutral-700 text-lg w-full bg-white text-black dark:bg-neutral-800 dark:text-white dark:border-white focus:dark:border-cyan-300 focus:border-neutral-700 focus:outline-none"
                        value={NewPostState.postData.category}
                        onChange={e => NewPostState.setCategory(e.target.value)}
                        disabled={NewPostState.isPosting}
                    >
                        {Categories.map(opt => <option value={opt['code']} key={opt['code']}>{opt['name']}</option>)}
                    </select>
                </div>

                <Button
                    disabled={NewPostState.isPosting}
                    text={<>{NewPostState.isPosting ? <Loading /> : []}Post Anonymously</>}
                />
            </form>
        </div>
    )
})

export default NewPost;