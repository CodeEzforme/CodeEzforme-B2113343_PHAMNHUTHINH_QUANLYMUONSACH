<template>
  <div>
    <AppHeader />
    <div class="container mt-3 mb-3">
      <div class="add-new">Thêm đầu sách</div>
      <div class="form">
        <form
          @submit.prevent="add"
          action=""
          enctype="multipart/form-data"
          accept="image/*"
          method="post"
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
            <label class="label" for="price">Giá:</label><br />
            <input
              class="input"
              type="number"
              id="price"
              v-model="formData.price"
            />
          </div>

          <div class="form-item">
            <label class="label" for="quantity">Số lượng:</label><br />
            <input
              class="input"
              type="number"
              id="quantity"
              v-model="formData.quantity"
            />
          </div>

          <div class="form-item">
            <label class="label" for="author">Tác giả:</label><br />
            <input
              class="input"
              type="text"
              id="author"
              v-model="formData.author"
            />
          </div>

          <div class="form-item">
            <label class="label" for="publisherName">Tên nhà xuất bản:</label
            ><br />
            <input
              class="input"
              type="text"
              id="publisherName"
              v-model="formData.publisherName"
            />
          </div>

          <div class="form-item">
            <label class="label" for="publishYear">Năm xuất bản:</label><br />
            <input
              class="input"
              type="text"
              id="publishYear"
              v-model="formData.publishYear"
            />
          </div>

          <div class="form-item">
            <label class="label" for="publisherAddress">Địa chỉ NXB:</label
            ><br />
            <input
              class="input"
              type="text"
              id="publisherAddress"
              v-model="formData.publisherAddress"
            />
          </div>

          <div class="form-item">
              <label class="label" for="thumbnail">Ảnh:</label><br />
              <div class="d-flex justify-center align-items-center flex-column">
                <input
                    class="form-control"
                    style="font-size: 1.6rem; padding: .75rem"
                    size="80"
                    type="file"
                    id="fileInput"
                    name='thumbnail'
                    upload-image
                    @change="handleImageUpload($event)"
                  />
                  <div class='image-preview-wrap'>
                    <img
                      :src="imagePreview"
                      class='image-preview'
                      upload-image-preview
                    >
                  </div>
              </div>
          </div>
            <button type="submit" class="btn btn-primary">Tạo</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import BookService from "@/services/admin/book.service";

export default {

  data() {
    return {
      formData: {
        id_publisher: "",
        bookTitle: "",
        price: 0,
        quantity: 0,
        publishYear: "",
        author: "",
        thumbnail: "",
      },
    };
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
.container {
  width: 80%;
  width: 600px;
  height: 1050px;
  text-align: center;
  padding: 20px;
  background-color: #f5f5f5;
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
  width: 11rem;
  height: auto;
  object-fit: cover;
}
.image-preview[src=""] {
  display: none;
}
</style>
