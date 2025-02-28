import { useContext, useState } from "react";
import axios from "axios";
import { Label, TextInput, Textarea, Select, FileInput, Button, Spinner } from "flowbite-react";
import AppContext from '../context/ContextApp'
import { useNavigate } from "react-router-dom";

const AddItem = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(""); // Store uploaded image URL
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { backendURL } = useContext(AppContext) // Replace with your backend URL

    // Function to handle image upload
    const handleImageUpload = async () => {
        if (!image) {
            alert("Please select an image first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", image); // The key "file" should match your backend's upload key

        setLoading(true);

        try {
            const response = await axios.post(`${backendURL}/api/item/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Image uploaded:", response);
            setImageUrl(response.data.imageUrl); // Store Cloudinary URL
            setLoading(false);
        } catch (error) {
            console.error("Upload failed:", error.message);
            alert("Image upload failed!");
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageUrl) {
            alert("Please upload an image first!");
            return;
        }

        const formData = {
            name,
            description,
            price,
            stock,
            category,
            imageUrl, // Send Cloudinary URL instead of file
        };

        try {
            const { data } = await axios.post(`${backendURL}/api/item/add-item`, formData);
            console.log(data);

            if (data.success) {
                navigate("/");
            }

            // alert("Product added successfully!");
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="flex w-2/3 flex-col gap-4 bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center">Add New Product</h2>

                {/* Name */}
                <div>
                    <Label htmlFor="name" value="Product Name" />
                    <TextInput id="name" type="text" placeholder="Enter product name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                {/* Description */}
                <div>
                    <Label htmlFor="description" value="Description" />
                    <Textarea id="description" placeholder="Enter product description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>

                {/* Price & Stock */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <Label htmlFor="price" value="Price ($)" />
                        <TextInput id="price" type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="stock" value="Stock Quantity" />
                        <TextInput id="stock" type="number" placeholder="Enter stock quantity" value={stock} onChange={(e) => setStock(e.target.value)} required />
                    </div>
                </div>

                {/* Category (Dropdown) */}
                <div>
                    <Label htmlFor="category" value="Category" />
                    <Select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option value="">Select a category</option>
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="books">Books</option>
                        <option value="home_appliances">Home Appliances</option>
                    </Select>
                </div>

                {/* Image Upload */}
                <div>
                    <Label htmlFor="image" value="Upload Image" />
                    <FileInput id="image" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />
                </div>

                {/* Upload Button */}
                <Button type="button" onClick={handleImageUpload} disabled={loading} className="mt-2">
                    {loading ? <Spinner size="sm" className="mr-2" /> : "Upload Image"}
                </Button>

                {/* Display Uploaded Image */}
                {imageUrl && <img src={imageUrl} alt="Uploaded" className="w-32 h-32 mt-4 rounded-lg shadow-md" />}

                {/* Submit Button */}
                <Button type="submit" className="mt-4 w-full">
                    Add Product
                </Button>
            </form>
        </div>
    );
};

export default AddItem;
