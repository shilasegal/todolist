// document.getElementById("id").style.visibility = 'hidden';
// console.log(document.getElementById("id"))
// document.getElementById("signinbtn").style.visibility = 'hidden';
// visibility: hidden;

document.getElementById("loginbtn").addEventListener('click',(event) =>
{
    const Http = new XMLHttpRequest();
    const url='http://localhost:3000/users/login?user_name=' + document.getElementById("logname").value;
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        if(Http.readyState == 4) {
            const user_id = parseInt(JSON.parse(Http.responseText).user_id);
            if(user_id > 0)
            {
                localStorage.setItem('user_id', JSON.stringify(user_id));
                window.location.replace("/index");// = 'http://localhost:63342/todoclient/index.html';//?user_id='+user_id;
            }
            else
            {
                window.alert("please sign in");
            }
        }
    }
});

document.getElementById("signinbtn").addEventListener('click',(event) =>
{
    const Http = new XMLHttpRequest();
    const url='http://localhost:3000/users/signin?user_name=' + document.getElementById("signname").value
        + '&user_id='+ document.getElementById("signid").value;
    Http.open("POST", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        if(Http.readyState == 4) {
            const user_id = parseInt(JSON.parse(Http.responseText).user_id);
            if(user_id > 0)
            {
                localStorage.setItem('user_id', JSON.stringify(user_id));
                window.location.replace("/index");// = 'http://localhost:63342/todoclient/index.html';//?user_id='+user_id;
            }
            else
            {
                window.alert("user by this name or ID already exsits! \n please dont steal people identity. please..");
            }
        }
    }
});