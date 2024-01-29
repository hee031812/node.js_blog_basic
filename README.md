### client
`npx create-react-app .   `
`npm install react-bootstrap bootstrap`   
[css bootstrap](https://react-bootstrap.netlify.app/docs/components/buttons)  
`npm install react-router-dom `
`npm install axios`
`npm install http-proxy-middleware`
`npm install @emotion/css`
`npm install @emotion/react`
`npm install @emotion/styled`



### server
```bush
npm init -y;
npm install express;   
npm install express --save;  
npm install nodemon --save; -> 자동 수정   
npm install path --save; -> server와 client를 연결해주는것.
npm install mongoose --save;
npm install multer --save;
 ```

 <참고>   
`mkdir`폴더만들기  
`rm + 폴더명` 폴더삭제   
`echo "" > readme.md` 리드미 만들기   

 [참고사이트](https://expressjs.com/)

### 제작과정 
#### server indexPage
client에서 build한 후 아래 코드 작성
```js
const express = require("express");
const path = require("path");
const app = express();
const port = 5050;


app.use(express.static(path.join(__dirname, "../client/build")))

app.listen(port, () => {
    console.log("running -->" + port);
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
})
```

### 몽고DB 연동
- express 설치과정

[몽고 DB연결](https://cloud.mongodb.com/v2/655c452063a8dd4a61cd8e60#/clusters/connect?clusterId=Cluster0)   
[몽구스](https://mongoosejs.com/) 코드 가져오기
몽구스는 몽고DB와 Express.js 웹 애플리케이션 프레임워크 간 연결을 생성하는 자바스크립트 객체 지향 프로그래밍 라이브러리이다.

받아온 몽고 DB 코드를 connect 안에 넣어준다.
```js
app.listen(port, () => {
    mongoose
        .connect(
            'mongodb+srv://hee031812:elvmfpdj12!!@cluster0.rxihsko.mongodb.net/?retryWrites=true&w=majority'
        )
        .then(() => {
            console.log("running -->" + port);
            console.log("connecting --> mobngDB.....");
        })
        .catch((err) => {
            console.log(err)
        })
})
```

### 서버와 client 연결하기
build 후 path 설치   
`npm install path --save;`   

설치후 맨위에 path작성해준다. 그 이후 조인으로 경로를 입력해준다.
서버와 client를 연결해준다.

```js
const path = require("path");
```

```js
app.use(express.static(path.join(__dirname, "../client/build")));
app.listen(port, () => {
    console.log("listening --> " + port);
});

app.get("/", (req, res) => {
    res.send(path.join(__dirname), "../client/build/index.html");
});
```

### client에서 데이터 전달하기   
//list.js 에서 작업   
```js
import React, { useEffect } from 'react'
import axios from 'axios';

const [text, setTest] = useState("");

const List = () => {
    useEffect(() => {
        axios.post('/api/test')
            .then((response) => {
                alert("요청성공")
                console.log(response);
            })
            .catch((error) => {
                alert("요청실패")
                console.log(error);
            });
    }, [])
    return (
        <div>{text}</div>
    )
}
```

//server index 에서 작업   
```js
app.post("/api/test", (req, res) => {
    console.log(req)
    res.status(200).json({ success: true });
})

```
#### 연결이 안될시 해결방법
client 와 server 연결하기 위한 middleware 설치 후 아래문법 작성   
setupProxy 파일에 아래 문법 작성.   
```js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:5050',
            changeOrigin: true,
        })
    );
};
```

### server에서 client 데이터 전달하기   
body peth설정   
//list.js    
```js
   let body = {
            text: " 다시보낸다! 받아라잉"
        }
```
undefind 가 나올시 아래 문법 작성.   
원활하게 데이터 보내기 위한 미들웨어 사용.   
//index.js    
```js
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
``` 

### 몽고DB에 보내기 테이블 구조 잡기 (모델 : 스키마 생성)
mongoose collection 

//server에 Model 폴더 만든후 Post.js 파일 만들기   

```js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
});

const Post = mongoose.model("post", postSchema);

module.exports = { post };
```

//indet.js 에 연동
```js
const {post} = require("./Model/Post.js");
   
app.post("/api/test", (req, res) => {
  const BlogPost = new Post({ title: "테스트", content: "테스트입니다." });
  BlogPost.save().then(() => {
    res.status(200).json({ success: true });
  });
});
    
```

### id 만들기 
// Model/Count.js
```js 내부 스키마 생성.
const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
    name: String,
    postNum: Number
}, { collection: "counter" });

const Counter = mongoose.model("Counter", counterSchema);

module.exports = { Counter };
```

DATABASE/counter 에서 insert 시켜준다.

```js
_id
6568379dc4ebe5ca7a0dc7c0
name
"counter"
postNum
1
```


### detail 페이지 연동

Link를 넣어서 postNum을 가져오게 작성.
```js
return (
        <div>
            <h3>글 목록</h3>
            {postList.map((post, key) => (
                <div key={key} className='post'>
                    <h3>제목:{post.title}</h3>
                    <p>내용:{post.content}</p>
                    <Link to={`/post/${post.postNum}`}>내용보기</Link>
                </div>
            ))}
        </div>
    )

```

list에 내용보기를 추가해준뒤 아래 데이터를 가져오나 확인.
```js 
const List = () => {
    const [postList, setPostList] = useState([]);


    useEffect(() => {
        axios.post('/api/post/list')
            .then((response) => {
                console.log(response.data)
                if (response.data.success) {
                    setPostList([...response.data.postList]);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

```

server index.js
```js
// detail 연동(postNum 가져오기)
app.post("/api/post/detail", (req, res) => {
    Post.findOne({ postNum: req.body.postNum })
        .exec() //실행문
        .then((doc) => {
            console.log(doc)
            res.status(200).json({ success: true, post: doc })
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ success: false });
        });
})
```


### Edit 수정하기

데이터 가져오기
```js
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Edit = () => {
    let params = useParams();

    const [postInfo, setPostInfo] = useState({});
    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");

    // 데이터 가져오기
    useEffect(() => {
        let body = {
            postNum: params.postNum
        }

        axios.post("/api/post/detail", body)
            .then((respons) => {
                if (respons.data.success) {
                    setPostInfo(respons.data.post)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }, [params.postNum])



    useEffect(() => {
        setTitle(postInfo.title);
        setContents(postInfo.content);
    }, [postInfo])

```
edit.js파일
데이터 뿌려주기
```js
 <div style={{ padding: "20px" }}>
            <form>
                <label>제목</label>
                <input
                    id='title'
                    type='text'
                    value={title || ""}
                    onChange={(event) => {
                        setTitle(event.currentTarget.value);
                    }}
                /><br />
                <label htmlFor='content'>내용 </label>
                <textarea
                    id='contents'
                    value={contents || ""}
                    onChange={(event) => {
                        setContents(event.currentTarget.value);
                    }}
                >
                </textarea>
                <div>
                    <button onClick={(e) => {
                        e.preventDefault();
                        navigate(-1); // 전페이지 가기
                    }}>취소
                    </button>
                    <button
                        onClick={(e) => {
                            onsubmit(e); // 제출하기
                        }}>제출</button>
                </div>
            </form>
        </div>

```


### express 라우팅 작업

#### post 방식이라고 적혀 있는것들을 따로 외부로 빼주는 작업
express.Router

server에 Router폴더를 만들고 그 안에 post.js 생성

그 후에 아래 문장 작성
```js
var express = require('express');
var router = express.Router();
```

server indexjs 에서 가져와서 post에 넣기
```js
const { Post } = require("../Model/Post.js");
const { Counter } = require("../Model/Counter.js");
```

아래 부분의 app.post부분을 router.post로 작성해주고 주소값 안에있는 post를 삭제해준다.
```
router.post("/submit", (req, res) => {
```


### IMG 파일 넣는 작업

npm install multer 멀터 설치

사진 입력을 위한 스크립트
```js
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/my-uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

const upload = multer({ storage: storage })
```
ImageUplaod 
```js
import React from 'react'
import { Form } from 'react-bootstrap'
import axios from 'axios';


const ImageUpload = () => {
    const FileUpload = (e) => {
        let formData = new FormData();

        formData.append("file", (e.target.files[0]))

        axios
            .post("/api/post/image/upload", formData)
            .then((response) => {
                console.log(response.data)
            })
    }

    return (
        <div>
            <Form.Control
                type="file"
                accept='image/*'
                onChange={(e) => FileUpload(e)}
            />

        </div>
    )
}

export default ImageUpload
```

router-post.js 파일에 작성
```js
//이미지 파일 전송하기
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'image')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({ storage: storage }).single("file");

router.post("/image/upload", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ success: false })
        } else {
            res.status(200).json({ success: true, filepath: res.req.file.path })
        }
    })
})
```

uplaod 파일에 이미지 업로드 시켜주기

props 시켜주고 
model-post.js에 스키마 추가 시켜주기