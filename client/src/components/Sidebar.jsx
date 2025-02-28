// import { Button, Drawer } from "flowbite-react";
// import { HiOutlineArrowRight } from 'react-icons/hi';
// import { useState } from "react";

// const Sidebar = ({ onFilterChange }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [sortOption, setSortOption] = useState("");
//     const [priceRange, setPriceRange] = useState(1000);
//     const [categories, setCategories] = useState([]);

//     const handleClose = () => setIsOpen(false);

//     // Function to update filters
//     const applyFilters = () => {
//         handleClose();
//         onFilterChange({ sort: sortOption, priceRange, category: categories });
//     };

//     return (
//         <div className="z-20">
//             <div className="fixed left-2 top-[4.5rem] z-30">
//                 <Button color='gray' onClick={() => setIsOpen(true)} outline>
//                     <HiOutlineArrowRight className="h-6 w-6" />
//                 </Button>
//             </div>

//             <Drawer className="z-40" open={isOpen} onClose={handleClose}>
//                 <Drawer.Header title="Filters" />
//                 <Drawer.Items>
//                     {/* Sorting Options */}
//                     <div>
//                         <p className="font-semibold">Sort by:</p>
//                         <label><input type="radio" name="sort" value="price-low" onChange={() => setSortOption("price-low")} /> Price: Low to High</label><br />
//                         <label><input type="radio" name="sort" value="price-high" onChange={() => setSortOption("price-high")} /> Price: High to Low</label><br />
//                         <label><input type="radio" name="sort" value="alpha-asc" onChange={() => setSortOption("alpha-asc")} /> Name: A-Z</label><br />
//                         <label><input type="radio" name="sort" value="alpha-desc" onChange={() => setSortOption("alpha-desc")} /> Name: Z-A</label>
//                     </div>

//                     {/* Price Range Filter */}
//                     <div className="mt-4">
//                         <p className="font-semibold">Max Price: {priceRange}</p>
//                         <input type="range" min="0" max="1000" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} />
//                     </div>

//                     {/* Category Filter */}
//                     <div className="mt-4">
//                         <p className="font-semibold">Category:</p>
//                         <label><input type="checkbox" value="Electronics" onChange={(e) => setCategories([...categories, e.target.value])} /> Electronics</label><br />
//                         <label><input type="checkbox" value="Clothing" onChange={(e) => setCategories([...categories, e.target.value])} /> Clothing</label><br />
//                         <label><input type="checkbox" value="Home" onChange={(e) => setCategories([...categories, e.target.value])} /> Home</label>
//                     </div>

//                     <Button className="mt-4" onClick={applyFilters}>Apply Filters</Button>
//                 </Drawer.Items>
//             </Drawer>
//         </div>
//     );
// }

// export default Sidebar;


import { Button, Drawer } from "flowbite-react";
import { HiOutlineArrowRight } from 'react-icons/hi';
import { useState } from "react";

const Sidebar = ({ onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sortOption, setSortOption] = useState("");
    const [priceRange, setPriceRange] = useState(1000);
    const [categories, setCategories] = useState([]);

    const handleClose = () => setIsOpen(false);

    // Apply filters
    const applyFilters = () => {
        handleClose();
        onFilterChange({ sort: sortOption, priceRange, category: categories });
    };

    // Reset filters
    const resetFilters = () => {
        setSortOption("");
        setPriceRange(1000);
        setCategories([]);
        onFilterChange({ sort: "", priceRange: 1000, category: [] });
    };

    return (
        <div className="z-20">
            <div className="fixed left-2 top-[4.5rem] z-30">
                <Button color="gray" onClick={() => setIsOpen(true)} outline>
                    <HiOutlineArrowRight className="h-6 w-6" />
                </Button>
            </div>

            <Drawer className="z-40" open={isOpen} onClose={handleClose}>
                <Drawer.Header title="Filters" />
                <Drawer.Items>
                    {/* Sorting Options */}
                    <div>
                        <p className="font-semibold">Sort by:</p>
                        <label>
                            <input type="radio" name="sort" value="price-low"
                                checked={sortOption === "price-low"}
                                onChange={() => setSortOption("price-low")} />
                            Price: Low to High
                        </label><br />
                        <label>
                            <input type="radio" name="sort" value="price-high"
                                checked={sortOption === "price-high"}
                                onChange={() => setSortOption("price-high")} />
                            Price: High to Low
                        </label><br />
                        <label>
                            <input type="radio" name="sort" value="alpha-asc"
                                checked={sortOption === "alpha-asc"}
                                onChange={() => setSortOption("alpha-asc")} />
                            Name: A-Z
                        </label><br />
                        <label>
                            <input type="radio" name="sort" value="alpha-desc"
                                checked={sortOption === "alpha-desc"}
                                onChange={() => setSortOption("alpha-desc")} />
                            Name: Z-A
                        </label>
                    </div>

                    {/* Price Range Filter */}
                    <div className="mt-4">
                        <p className="font-semibold">Max Price: {priceRange}</p>
                        <input type="range" min="0" max="1000" value={priceRange}
                            onChange={(e) => setPriceRange(Number(e.target.value))} />
                    </div>

                    {/* Category Filter */}
                    <div className="mt-4">
                        <p className="font-semibold">Category:</p>
                        <label>
                            <input type="checkbox" value="Electronics"
                                checked={categories.includes("Electronics")}
                                onChange={(e) => {
                                    setCategories(e.target.checked
                                        ? [...categories, e.target.value]
                                        : categories.filter(c => c !== e.target.value));
                                }} />
                            Electronics
                        </label><br />
                        <label>
                            <input type="checkbox" value="Clothing"
                                checked={categories.includes("Clothing")}
                                onChange={(e) => {
                                    setCategories(e.target.checked
                                        ? [...categories, e.target.value]
                                        : categories.filter(c => c !== e.target.value));
                                }} />
                            Clothing
                        </label><br />
                        <label>
                            <input type="checkbox" value="Home"
                                checked={categories.includes("Home")}
                                onChange={(e) => {
                                    setCategories(e.target.checked
                                        ? [...categories, e.target.value]
                                        : categories.filter(c => c !== e.target.value));
                                }} />
                            Home
                        </label>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <Button onClick={applyFilters}>Apply Filters</Button>
                        <Button color="gray" onClick={resetFilters}>Reset Filters</Button>
                    </div>
                </Drawer.Items>
            </Drawer>
        </div>
    );
};

export default Sidebar;
