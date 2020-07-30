const socket = io()

// Elements
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton = $messageForm.querySelector("button")
const $sendlocationButton = document.querySelector("#send-location")
const $message = document.querySelector("#message")

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML

socket.on("message", (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate, {message:message})
    $message.insertAdjacentHTML("beforeend", html)
})

$messageForm.addEventListener("submit", e => {
    e.preventDefault()

    $messageFormButton.setAttribute("disabled","disabled")

    const message = e.target.elements.message.value

    socket.emit("sendMessage", message, (error) =>{
        $messageFormButton.removeAttribute("disabled")
        $messageFormInput.value = ""
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log("Message delivered!...")
    })
})

$sendlocationButton.addEventListener("click", ()=> {
    if(!navigator.geolocation){
        return alert("Geolocation Feature is not supported by your browser.")
    }

    $sendlocationButton.setAttribute("disabled","disabled")

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit("sendLocation", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },() =>{
            $sendlocationButton.removeAttribute("disabled")
            console.log("Location Shared...")
        })
    })
})