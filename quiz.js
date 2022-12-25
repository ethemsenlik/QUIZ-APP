function Soru(soruMetni, cevapSecenekleri, dogruCevap) {
    this.soruMetni = soruMetni;
    this.cevapSecenekleri = cevapSecenekleri;
    this.dogruCevap = dogruCevap;

}

Soru.prototype.cevabıKontrolEt = function(cevap) {
    return cevap === this.dogruCevap;
}

let sorular = [
    new Soru ("1.  JavaScript'i kodlarını hangi iki etiket arasına yazarız ?", {a:"javascript", b:"js", c:"script"}, "c"),
    new Soru ("2.  Javascript'te hangisi doğru bir değişken tanımlama şeklidir ?", {a:"v evrenselkod;", b:"variable evrenselkod;", c:"var evrenselkod;"}, "c"),
    new Soru ("3.  Hangi komutla bir uyarı mesajı oluşturabilirsiniz ?", {a: "alert", b:"alertBox", c:"msgBox"}, "a"),
    new Soru ("4.  JavaScript'te bir fonksiyon nasıl oluşturulur ?", {a:"function = fonksiyonum()", b:"function fonksiyonum()", c:"function : fonksiyonum()"}, "b"),
    new Soru ("5.  Javascript'te 'fonksiyonum' isimli bir fonkisyon nasıl çağırılır ?", {a:"fonksiyonum()", b:"call fonksiyonum()", c:"call function fonksiyonum()"}, "a"),
    new Soru ("6.  JavaScript'te bir 'while' ifadesi nasıl yazılır?", {a:"while (i <= 10; i++)", b:"while (i <= 10)", c:"while i = 1 to 10"}, "a")
]

function Quiz(sorular) {
    this.sorular = sorular;
    this.soruIndex = 0;
    this.dogruCevapSayısı = 0;
}

Quiz.prototype.soruGetir = function() {
    return this.sorular[this.soruIndex];
}

const quiz = new Quiz(sorular);

document.querySelector(".btn-start").addEventListener("click", function() {
    document.querySelector(".quiz_box").classList.add("active");
    startTimer(10);
    soruGoster(quiz.soruGetir());
    soruSayısınıGoster(quiz.soruIndex + 1, quiz.sorular.length);
    document.querySelector(".next-btn").classList.remove("show");
})

document.querySelector(".next-btn").addEventListener("click", function() {
    if (quiz.sorular.length != quiz.soruIndex +1) {
        document.querySelector(".quiz_box").classList.add("active");
        quiz.soruIndex += 1;
        clearInterval(counter);
        startTimer(10);
        soruGoster(quiz.soruGetir());
        soruSayısınıGoster(quiz.soruIndex + 1, quiz.sorular.length);
        document.querySelector(".next-btn").classList.remove("show");
    } else {
        clearInterval(counter)
        document.querySelector(".score_box").classList.add("active");
        document.querySelector(".quiz_box").classList.remove("active");
        skoruGoster(quiz.sorular.length, quiz.dogruCevapSayısı);
    }
})

const option_list = document.querySelector(".option_list");
const correctIcon = '<div class="icon"><i class="fas fa-check"></i></div>';
const incorrectIcon = '<div class="icon"><i class="fas fa-times"></i></div>';

function soruGoster(soru) {
    let question = `<span>${soru.soruMetni}</span>`
    let options = "";

    for(let cevap in soru.cevapSecenekleri) {
        options += 
            `
                <div class="option">
                    <span><b>${cevap}</b>: ${soru.cevapSecenekleri[cevap]}</span>
                </div>
            `;
    }

    document.querySelector(".question_text").innerHTML = question;
    option_list.innerHTML = options;

    const option = option_list.querySelectorAll(".option");

    for (let opt of option) {
        opt.setAttribute("onclick", "optionSelected(this)");
    }
}

function optionSelected(option) {
    clearInterval(counter);
    let cevap = option.querySelector("span b").textContent;
    let soru = quiz.soruGetir();

    if(soru.cevabıKontrolEt(cevap)) {
        quiz.dogruCevapSayısı += 1;
        option.classList.add("correct");
        option.insertAdjacentHTML("beforeend", correctIcon)
    } else {
        option.classList.add("incorrect");
        option.insertAdjacentHTML("beforeend", incorrectIcon)
    }

    for(let i = 0; i < option_list.children.length; i++) {
        option_list.children[i].classList.add("disabled");
    }

    document.querySelector(".next-btn").classList.add("show");
}

function soruSayısınıGoster (soruSırası, toplamSoru) {
    let tag = `<span class="badge bg-warning">${soruSırası} / ${toplamSoru}</span>`;
    document.querySelector(".card-footer .question_index").innerHTML = tag;
}

function skoruGoster(toplamSoru, dogruCevap) {
    let tag = `<div class="score_text">Toplam ${toplamSoru} soruda ${dogruCevap} doğru cevap verdiniz.</div>`;
    document.querySelector(".score_box .score_text").innerHTML = tag;
}

document.querySelector(".btn-replay").addEventListener("click", function() {
    window.location.reload();
    quiz.soruIndex = 0;
    quiz.dogruCevapSayısı =0;
    document.querySelector(".btn-start").click();
    document.querySelector(".score_box").classList.remove("active");
}) 

document.querySelector(".btn-quit").addEventListener("click", function () {
    window.location.reload();
})

let counter;
function startTimer(time) {
    counter = setInterval(timer, 1000);

    function timer() {
        document.querySelector(".time-second").textContent = time;
        time--;

        if(time < 0) {
            clearInterval(counter);
            document.querySelector(".time-text").textContent = "Süre Bitti"

            let cevap = quiz.soruGetir().dogruCevap;

            for(let option of option_list.children) {

                if(option.querySelector("span b").textContent == cevap) {
                    option.classList.add("correct");
                    option.insertAdjacentHTML("beforeend", correctIcon);
                }

                option.classList.add("disabled");
            }

            document.querySelector(".next-btn").classList.add("show")
        }
    }
}

