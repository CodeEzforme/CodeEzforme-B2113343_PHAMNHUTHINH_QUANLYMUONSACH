<template>
    <div class="back-ground" >
      <ClientAppHeader/>
      <div class="container mt-3 mb-3">
        <div class="add-new">Thêm đầu sách</div>
        <div class="form">
            <!-- <form
            @submit.prevent="add"
            action=""
            enctype="multipart/form-data"
            accept="image/*"
            method="post"
          > -->
          <form
            @submit.prevent="updateBook()"

          >
            <div class="form-item">
              <label class="label" for="bookTitle">Tên sách:</label><br />
              <input
                class="input"
                type="text"
                id="bookTitle"
                v-model="formData.bookTitle"
              />
            </div>

            <div class="form-item">
              <label class="label" for="price">Số lượng:</label><br />
              <input
                class="input"
                type="number"
                id="quantity"
                min=1
                v-model="formData.quantity"
              />
            </div>

            <div class="form-item">
              <label class="label" for="price">Giá:</label><br />
              <input
                class="input"
                type="number"
                id="price"
                readonly="true"
                v-model="formData.price"
              />
            </div>

            <div class="form-item">
              <label class="label" for="borrowDate">Ngày mượn:</label><br />
              <input
                class="input"
                type="date"
                id="borrowDate"
                :min="new Date().toISOString().substr(0, 10)"
                v-model="formData.borrowDate"
              />
            </div>

            <div class="form-item">
              <label class="label" for="returnDate">Ngày trả: Hạn trả sách là sao 30 ngày kể từ ngày mượn sách</label><br />
              <input
                class="input"
                type="date"
                id="returnDate"
                :min="formData.borrowDate"
                v-model="formData.returnDate"
              />
            </div>
            <button type="submit" class="btn btn-primary">Tạo</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Cookies from 'js-cookie';
  import { toast } from "vue3-toastify";
  import "vue3-toastify/dist/index.css";
  import BookService from "@/services/client/book.service";
  import readerService from "@/services/client/reader.service";
  import ClientAppHeader from '../../../../components/client/ClientAppHeader.vue';

  export default {
  components: { ClientAppHeader },
  
    data() {
      return {
        formData: {
          bookTitle: "",
          price: 0,
          quantity: 0,
          borrowDate: "",
          returnDate: "",
        },
        token: "",
      };
    },

    mounted() {
        this.retrieve(this.$route.params.id);
    },

    computed: {},

    methods: {
      handleImageUpload($event) {
        const file = $event.target.files[0];
        if (file) {
          this.formData.thumbnail = file;
          const reader = new FileReader();
          reader.onloadend = () => {
            this.imagePreview = reader.result;
          }
          reader.readAsDataURL(file);
        }
      },

        async retrieve(bookId) {
            try {
                const token = Cookies.get('tokenUser');
                this.token = token;
                const book = await BookService.get(bookId);
                // console.log(token);
                if (book) {
                    this.formData.bookTitle = book.bookTitle;
                    this.formData.price = book.price;
                    this.formData.id_book = bookId;
                } else {
                    console.log("Book not found");
                }

                console.log(book);
            } catch (error) {
                console.log(error);
            }
        },
        async updateBook() {
            try {
                const book = await BookService.get(this.formData.id_book);
                const numberBorrowed = await readerService.getNumberBorrowed(this.formData.id_book)
                // console.log(numberBorrowed)
                // console.log(book.quantity)
                if (this.formData.quantity > book.quantity - numberBorrowed) {
                    alert('Số sách bạn mượn vượt quá số sách còn lại!');
                    return;
                }

                if (!this.formData.borrowDate) {
                  this.formData.borrowDate = new Date().toISOString().substr(0, 10);
                }

                if (!this.formData.returnDate) {
                  alert('Thời gian trả không được để trống. vui lòng nhập lại!');
                  return;
                } else {
                  let maxDate = new Date(this.formData.borrowDate);
                  maxDate.setDate(maxDate.getDate() + 30);
                  maxDate.toISOString().substr(0, 10);
                  if(this.formData.returnDate > maxDate.toISOString().substr(0, 10)){
                    // this.formData.returnDate = maxDate.toISOString().substr(0, 10);
                    alert('Thời gian mượn sách vượt quá thời gian cho phép. vui lòng nhập lại!');
                    return;
                  }
                }


                const formData = new FormData();

                formData.append("id_book", this.formData.id_book);
                formData.append("quantity", this.formData.quantity);
                formData.append("borrowDate", this.formData.borrowDate);
                formData.append("returnDate", this.formData.returnDate);
                console.log(this.formData);
                const response = await readerService.updateBorrow(
                    this.token,
                    this.formData,
                );
                this.$router.push('/books');
            } catch (error) {
                console.log(error);
            }
        },
      async add($event) {
        $event.preventDefault();

        try {
          if (
            !this.formData.bookTitle ||
            !this.formData.price ||
            !this.formData.quantity ||
            !this.formData.author
          ) {
            toast.error("Please fill in all required fields.", {
              autoClose: 3000,
            });
            return;
          }
          const formData = new FormData();
          formData.append("bookTitle", this.formData.bookTitle);
          formData.append("price", this.formData.price);
          formData.append("quantity", this.formData.quantity);
          formData.append("publishYear", this.formData.publishYear); // Append the image file
          formData.append("publisherName", this.formData.publisherName);
          formData.append("publisherAddress", this.formData.publisherAddress);
          formData.append("author", this.formData.author);
          formData.append("thumbnail", this.formData.thumbnail);
          const response = await BookService.create(this.formData);
          console.log(response);
          toast.success("Added successfully!", {
            autoClose: 1200,
          });

          setTimeout(() => {
            this.$router.push({ name: "book" });
          }, 800);
        } catch (error) {
          console.log(error);
          const errorMessage = error.response?.data?.error || "Error!";
          toast.error(errorMessage, { autoClose: 3000 });
        }
      },
    },
  };
  </script>

  <style scoped>
  .back-ground {
    background-color: rgb(167, 213, 213);
    /* background-image: url("https://i.pinimg.com/236x/13/36/ae/1336ae5845f6e180b769e97b87d03704.jpg"); Đường dẫn đến hình ảnh nền */
    background-size: cover; /* Cách hình ảnh được điều chỉnh kích thước để phù hợp với kích thước của lớp */
    background-position: center; /* Vị trí chính giữa của hình ảnh nền */
  }

  .container {
    width: 80%;
    width: 600px;
    height: 1055px;
    text-align: center;
    padding: 20px;
    background-color: #e0e5da;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .add-new {
    font-size: 30px;
    margin-bottom: 20px;
  }

  .form-item {
    text-align: left;
    padding: 10px;
  }

  .label {
    font-weight: bold;
  }

  .input {
    width: 100%;
    /* height: 40px; */
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .image-preview {
    padding: 20px;
    width: 15rem;
    height: auto;
    object-fit: cover;
  }
  .image-preview[src=""] {
    display: none;
  }
</style>
