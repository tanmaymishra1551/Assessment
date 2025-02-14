import db from "../db/index.js"

export const testController = (req, res) => {
    res.status(200).json({ message: "Test controller of form is working!" })
}

export const checkData = (req, res) => {
    // console.log(req.body)
    // Extract details and inventories from the request body
    const { details, inventories } = req.body
    // console.log(`inventories`, inventories)

    if (!details || !inventories || !inventories.items) {
        return res
            .status(400)
            .json({ message: "Details and inventories are required" })
    }

    const { company, date, store, remarks } = details
    const items = inventories.items // Extract items array

    // Validate required fields
    if (!company || !date || !store) {
        return res
            .status(400)
            .json({ message: "Company name, date, and store are required" })
    }
    res.status(200).json({ message: "Successfull" })
}

export const createDetail = async (req, res) => {
    // Extract details and inventories from the request body
    const { details, inventories } = req.body
    // console.log(`inventories`, inventories)

    if (!details || !inventories || !inventories.items) {
        return res
            .status(400)
            .json({ message: "Details and inventories are required" })
    }

    const { company, date, store, remarks } = details
    const items = inventories.items // Extract items array

    // Validate required fields
    if (!company || !date || !store) {
        return res
            .status(400)
            .json({ message: "Company name, date, and store are required" })
    }

    if (!items.length) {
        return res
            .status(400)
            .json({ message: "At least one item is required" })
    }

    try {
        // Insert into details table
        const [newDetail] = await db("details")
            .insert({
                company_name: company,
                data: date,
                associated_stores: store,
                remarks: remarks || null,
            })
            .returning("*")

        // Insert into items table
        const itemRecords = items.map((item) => ({
            item_category: item.itemCategory,
            item: item.item,
            quantity: item.quantity,
            unit_of_measures: item.uom,
            total_cost: item.totalCost,
        }))
        // console.log(`itemRecords`, itemRecords)
        const insertedItems = await db("items")
            .insert(itemRecords)
            .returning("*")

        return res.status(200).json({
            message: "Detail and items added successfully",
            detail: newDetail,
        })
    } catch (err) {
        console.error("Error inserting data:", err)
        return res.status(500).json({ message: "Server error" })
    }
}

export const getCompanyData = async (req, res) => {
    try {
        const companies = await db("companies").select("company_name")

        // Check if any data was found
        if (!companies.length) {
            return res.status(404).json({ message: "No companies found" })
        }

        // Send the company data in the response
        return res.status(200).json({ companies })
    } catch (err) {
        console.error("Error fetching company data:", err)
        return res
            .status(500)
            .json({ message: "Server error", error: err.message })
    }
}
