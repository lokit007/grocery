let sum = (a, b) => {
    return new Promise((resolve, reject) => {
        if(isNaN(a) || isNaN(b)) reject(new Error("A, b phải là số nguyên!"));
        else resolve(a + b);
    });
};

let a = 5;
let b = "7.a";

sum(a, b)
.then(kq => {
    a = 3;
    return sum(kq, a);
})
.then(kq => {
    b = 5;
    return sum(kq, b);
})
.then(kq => console.log(kq))
.catch(er => console.log(er + ""));