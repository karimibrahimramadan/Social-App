class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find(...keyword);
    return this;
  }

  filter() {
    const queryStrObj = { ...this.queryStr };
    const excludedFields = ["keyword", "sort", "page", "limit", "fields"];
    excludedFields.forEach((element) => {
      delete queryStrObj[element];
    });
    let queryStr = JSON.stringify(queryStrObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  limitFields() {
    this.query = this.queryStr.fields
      ? this.query.select(this.queryStr.fields.split(",").join(" "))
      : this.query.select("-__v");
    return this;
  }

  sort() {
    this.query = this.queryStr.sort
      ? this.query.sort(this.queryStr.sort.split(",").join(" "))
      : this.query.sort("-createdAt");
    return this;
  }

  paginate() {
    const currentPage = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;
    const skip = (currentPage - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
