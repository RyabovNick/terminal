function loop() {
    function checker() {
        console.log('checker: ' + Date(Date.now()))
        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function() {
            console.log('state: ' + this.readyState + ' status: ' + this.status)
            if (this.readyState == 4 && this.status == 200) {
                //document.getElementById('form').innerHTML = this.responseText
                var arr = JSON.parse(this.responseText)

                var idx = 0
                var len = arr.length

                function showImage() {
                    console.log('showImage: ' + Date(Date.now()))
                    console.log('idx: ', idx)
                    console.log('len: ', len)

                    var entry = arr[idx]
                    console.log('entry: ', entry)

                    document.getElementById('form').innerHTML = entry.file

                    idx++

                    if (idx >= len) {
                        idx = 0
                    }
                }
                setInterval(showImage, 3 * 1000)

                showImage()
            }
        }
        xhr.open('GET', 'http://localhost:3000/api/getVideos', true)
        xhr.send()
    }
    setInterval(checker, 20 * 1000)

    checker()
}
