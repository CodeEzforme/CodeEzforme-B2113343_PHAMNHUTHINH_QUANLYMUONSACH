<template>
  <div>
    <AppHeader />
    <div class="container mt-3">
      <div class="page row">
        <div class="col-md-10">
          <InputSearch v-model="searchText" />
        </div>
        <div class="mt-3 col-8">
          <h4>
            Sách
            <i class="fa-solid fa-book"></i>
          </h4>

          <div class="">
            <button
              class="btn btn-sm btn-primary custom-margin"
              @click="refreshList()"
            >
              <i class="fas fa-redo"></i> Làm mới
            </button>
            <button
              class="btn btn-sm btn-success custom-margin"
              @click="goToAddBook"
            >
              <i class="fas fa-plus"></i> Thêm mới
            </button>
            <button
              class="btn btn-sm btn-danger custom-margin"
              @click="removeAllBooks"
            >
              <i class="fas fa-trash"></i> Xóa tất cả
            </button>
          </div>

          <BookList
            v-if="filteredBooksCount > 0"
            :books="filteredBooks"
            v-model:activeIndex="activeIndex"
          />
          <p v-else>Không có liên hệ nào.</p>
        </div>

        <div class="mt-3 col-4">
          <div v-if="activeBook">
            <h4>
              Chi tiết đầu sách
              <i class="fa-solid fa-book"></i>
            </h4>
            <BookDetail :book="activeBook" />
            <router-link
              :to="{
                name: 'book.edit',
                params: { id: activeBook._id },
              }"
            >
              <span class="mt-2 badge badge-warning" style="color: blue">
                <i class="fas fa-edit"></i> Hiệu chỉnh
              </span>
            </router-link>
            <span
              class="mt-2 badge badge-warning"
              style="color: red; cursor: pointer"
              @click="removeOneBook(activeBook)"
            >
              <i class="fa-solid fa-trash"></i> Xóa
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookDetail from "@/components/admin/BookDetail.vue";
import AppHeader from "@/components/admin/AppHeader.vue";
import InputSearch from "@/components/admin/InputSearch.vue";
import BookList from "@/components/admin/BookList.vue";
import BookService from "@/services/admin/book.service";

export default {
  components: {
    BookDetail,
    InputSearch,
    BookList,
    AppHeader,
  },
  // Đoạn mã xử lý đầy đủ sẽ trình bày bên dưới
  data() {
    return {
      books: [],
      activeIndex: -1,
      searchText: "",
    };
  },
  watch: {
    // Giám sát các thay đổi của biến searchText.
    // Bỏ chọn phần tử đang được chọn trong danh sách.
    searchText() {
      this.activeIndex = -1;
    },
  },
  computed: {
    // Chuyển các đối tượng book thành chuỗi để tiện cho tìm kiếm.
    booksStrings() {
      return this.books.map((book) => {
        const {
          bookTitle,
          price,
          quantity,
          publishYear,
          author,
          thumbnail,
        } = book;
        return [
          bookTitle,
          price,
          quantity,
          publishYear,
          author,
          thumbnail,
        ].join("");
      });
    },
    // Trả về các book có chứa thông tin cần tìm kiếm.
    filteredBooks() {
      if (!this.searchText) return this.books;

      return this.books.filter((_book, index) =>
        this.booksStrings[index].includes(this.searchText)
      );
    },
    activeBook() {
      if (this.activeIndex < 0) return null;
      return this.filteredBooks[this.activeIndex];
    },
    filteredBooksCount() {
      return this.filteredBooks.length;
    },
  },
  methods: {
    async retrieveBooks() {
      try {
        this.books = await BookService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    refreshList() {
      this.retrieveBooks();
      this.searchText = "";
      this.activeIndex = -1;
    },
    async removeOneBook(book) {
      if (confirm("Bạn muốn xóa cuốn sách này?")) {
        try {
          await BookService.delete(book._id);
          this.refreshList();
        } catch (error) {
          console.log(error);
        }
      }
    },
    async removeAllBooks() {
      if (confirm("Bạn muốn xóa tất cả Liên hệ?")) {
        try {
          await BookService.deleteAll();
          this.refreshList();
        } catch (error) {
          console.log(error);
        }
      }
    },
    goToAddBook() {
      this.$router.push({ name: "book.add" });
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
.page {
  text-align: left;
}

.custom-margin {
  margin-right: 10px; /* hoặc bất kỳ giá trị nào bạn muốn */
}
</style>
