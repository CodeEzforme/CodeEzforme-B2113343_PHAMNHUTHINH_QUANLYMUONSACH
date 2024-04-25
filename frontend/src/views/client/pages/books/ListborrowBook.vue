<template>
    <div>
      <ClientAppHeader />
      <div class="container mt-3">
        <h3>Sách đã mượn</h3>
        <template v-if="reader.borrow && reader.borrow.length > 0">
          <table class="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sách</th>
                <th>Số lượng</th>
                <th>Ngày mượn</th>
                <th>Ngày trả</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(borrowedBook, index) in reader.borrow" :key="borrowedBook._id">
                <td>{{ index + 1 }}</td>
                <td>{{ getBookName(borrowedBook.id_book) }}</td>
                <td>{{ borrowedBook.quantity }}</td>
                <td>{{ borrowedBook.borrowDate }}</td>
                <td>{{ borrowedBook.returnDate }}</td>
                <td class="text-primary">
                    {{borrowedBook.status === 'returned' ? 'Đã trả' : borrowedBook.status === 'processing' ? 'Đã mượn' :
                      'Unknown' }}
                </td>
                <td>
                  <button v-if="canReturn(borrowedBook.status)" class="btn btn-danger"
                    @click="statusBookReturn(reader, borrowedBook, 'returned')">
                    Trả
                  </button>
                  <button v-if="canDelete(borrowedBook.status)" class="btn btn-danger"
                    @click="deleteBook(borrowedBook.id_book)">
                    Xóa
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
        <template v-else>
          <p><i>Bạn chưa có đăng ký đơn mượn nào.</i></p>
        </template>
      </div>
    </div>
  </template>
  
  <script>
  import ClientBookDetail from "@/components/client/ClientBookDetail.vue";
  import ClientAppHeader from "@/components/client/ClientAppHeader.vue";
  import ClientInputSearch from "@/components/client/ClientInputSearch.vue";
  import ClientBookList from "@/components/client/ClientBookList.vue";
  import BookService from "@/services/client/book.service";
  import readerService from "@/services/client/reader.service";
  import Cookies from 'js-cookie';
  
  export default {
    components: {
      ClientBookDetail,
      ClientInputSearch,
      ClientBookList,
      ClientAppHeader,
    },
  
    data() {
      return {
        books: [],
        activeIndex: -1,
        searchText: "",
        token: "",
        reader: {},
      };
    },
    watch: {
      searchText() {
        this.activeIndex = -1;
      },
    },
    computed: {
      booksStrings() {
        return this.books.map((book) => {
          const {
            bookTitle,
            price,
            quantity,
            publishYear,
            author,
          } = book;
          return [
          bookTitle,
            price,
            quantity,
            publishYear,
            author,
          ].join("");
        });
      },
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
    async retrieveReaders() {
      try {
        const token = Cookies.get('tokenUser');
        this.token = token;
        let formData = new FormData();
        formData.append("tokenUser", token);

        this.reader = await readerService.getUserByToken(formData);
      } catch (error) {
        console.error('Errors when obtaining reader information:', error);
      }
    },
    async statusBookReturn(reader, borrowedBook, status) {
      try {
        const response = await readerService.statusBookReturn(
          reader._id,
          borrowedBook.id_book,
          status
        );
        await this.retrieveReaders();
        await this.retrieveBooks();
      } catch (error) {
        console.log(error);
      }
    },

    getBookName(bookId) {
      const book = this.books.find((book) => book._id === bookId);
      return book ? book.bookTitle : "Unknown";
    },
    canDelete(status) {
      return status === "returned";
    },
    canReturn(status) {
      return status === "processing";
    },
    async deleteBook(id) {
      const respone = await readerService.returnBookBorrow(id);
      this.retrieveBooks();
      this.retrieveReaders();
    },
    refreshList() {
      this.retrieveBooks();
      this.searchText = "";
      this.activeIndex = -1;
    },
  },
  mounted() {
    this.retrieveBooks();
    this.retrieveReaders();
    this.refreshList();
  },
};
</script>


<style scoped>
.page {
  text-align: left;
}

.text-danger {
  text-align: center;
}

.btn-success {
  background-color: #a3a09b;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-success:hover {
  background-color: #7f7d79;
}

.text-name {
  text-decoration: underline;
  color: #7f7d79;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  border-radius: 5px;
}

th {
  background-color: #8cb2eb;
  color: rgb(3, 3, 3);
}

tr:hover {
  background-color: #f2f2f2;
}

td button {
  margin-right: 5px;
}

td:nth-child(2) {
  text-align: left;
  width: 30%;
}

td:nth-child(3) {
  width: 7%;
}
</style>