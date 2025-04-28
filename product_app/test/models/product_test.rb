require "test_helper"

class ProductTest < ActiveSupport::TestCase
  test "should not save product without name" do
    product = Product.new(price: 10.0)
    assert_not product.save, "Saved the product without a name"
  end

  test "should not save product with negative price" do
    product = Product.new(name: "Test", price: -1)
    assert_not product.save, "Saved product with negative price"
  end
end
