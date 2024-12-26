$(document).ready(function() {
    // عرض وإخفاء التفاصيل
    $(".details-btn").on("click", function() {
        $(this).closest("tr").next(".details").toggleClass("hidden");
    });

    // تحديث السلة على الصفحة
    function updateCartUI() {
        let cart = JSON.parse(sessionStorage.getItem("cart")) || []; // قراءة السلة من sessionStorage
        let totalPrice = 0;

        // إفراغ قائمة السلة قبل إضافة العناصر الجديدة
        $("#cart-list").empty();

        if (cart.length === 0) {
            // إذا كانت السلة فارغة
            $("#cart-list").append("<li>السلة فارغة</li>");
        } else {
            // عرض الكتب المضافة إلى السلة
            cart.forEach(item => {
                $("#cart-list").append(
                    `<li><strong>العنوان:</strong> ${item.title}, <strong>السعر:</strong> ${item.price} ل.س</li>`
                );
                totalPrice += item.price; // حساب المجموع الكلي
            });
        }

        // تحديث المجموع الكلي
        $("#total-price").text(totalPrice);
    }

    // زر إضافة إلى السلة
    $(".add-to-cart").on("click", function() {
        // الحصول على البيانات من الزر
        const itemId = $(this).data("id");
        const itemTitle = $(this).data("title");
        const itemPrice = parseInt($(this).data("price"), 10);

        // جلب السلة الحالية من sessionStorage أو إنشاء سلة جديدة إذا لم تكن موجودة
        let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

        // إنشاء العنصر الجديد
        const newItem = { id: itemId, title: itemTitle, price: itemPrice };

        // إضافة العنصر إلى السلة
        cart.push(newItem);

        // تحديث sessionStorage
        sessionStorage.setItem("cart", JSON.stringify(cart));

        // تحديث واجهة السلة
        updateCartUI();

        alert(`تمت إضافة "${itemTitle}" إلى السلة!`);
    });

    // زر تفريغ السلة
    $("#empty-cart-btn").on("click", function() {
        // إزالة السلة من sessionStorage
        sessionStorage.removeItem("cart");

        // تحديث واجهة السلة بعد الإفراغ
        updateCartUI();
    });

    // زر إرسال نموذج سلة الشراء
    $("#cart-form").on("submit", function(event) {
        event.preventDefault(); // منع الإرسال الافتراضي للنموذج

        const fullName = $("#full-name").val().trim();
        const idNumber = $("#id-number").val().trim();
        const birthDate = $("#birth-date").val().trim();
        const mobileNumber = $("#mobile-number").val().trim();
        const email = $("#email").val().trim();

        // التحقق من صحة البيانات المدخلة
        const nameRegex = /^[\u0621-\u064A\s]+$/; // الاسم بالعربية فقط
        const idRegex = /^\d{11}$/; // الرقم الوطني 11 رقماً
        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/; // تاريخ الميلاد بصيغة dd-mm-yyyy
        const mobileRegex = /^(093|094|095|096|099)\d{6}$/; // أرقام موبايل MTN أو Syriatel
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // صيغة بريد إلكتروني صحيحة

        if (!nameRegex.test(fullName)) {
            alert("يرجى إدخال الاسم الكامل باللغة العربية فقط.");
            return;
        }

        if (!idRegex.test(idNumber)) {
            alert("يرجى إدخال رقم وطني صحيح مكون من 11 رقماً.");
            return;
        }

        if (!dateRegex.test(birthDate)) {
            alert("يرجى إدخال تاريخ ميلاد صحيح بالتنسيق dd-mm-yyyy.");
            return;
        }

        if (!mobileRegex.test(mobileNumber)) {
            alert("يرجى إدخال رقم موبايل صحيح تابع لشبكة MTN أو Syriatel.");
            return;
        }

        if (!emailRegex.test(email)) {
            alert("يرجى إدخال بريد إلكتروني صحيح.");
            return;
        }

        alert("تم إرسال المعلومات بنجاح!\n\n" +
            "الاسم: " + fullName + "\n" +
            "الرقم الوطني: " + idNumber + "\n" +
            "تاريخ الميلاد: " + birthDate + "\n" +
            "رقم الموبايل: " + mobileNumber + "\n" +
            "البريد الإلكتروني: " + email + "\n\n" +
            "مجموع السعر: " + $("#total-price").text() + " ل.س");

        this.reset(); // إعادة تعيين النموذج بعد الإرسال
    });

    // تحديث واجهة السلة عند تحميل الصفحة
    updateCartUI();
});