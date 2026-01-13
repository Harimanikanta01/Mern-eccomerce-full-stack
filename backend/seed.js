require('dotenv').config()
const connectDB = require('./config/db')
const bcrypt = require('bcryptjs')
const userModel = require('./models/userModel')
const productModel = require('./models/productModel')

async function seed(){
    await connectDB()

    // Create admin user if not exists
    const adminEmail = 'admin@example.com'
    const existingAdmin = await userModel.findOne({ email: adminEmail })
    const SERVER = process.env.SERVER_DOMAIN || 'http://localhost:8080'
    const defaultAdminPic = `${SERVER}/images/watches/${encodeURIComponent('boAt Wave Style Call 1.webp')}`

    if(!existingAdmin){
        const salt = bcrypt.genSaltSync(10)
        const hashed = bcrypt.hashSync('Admin123!', salt)
        const admin = new userModel({ name: 'Admin', email: adminEmail, password: hashed, role: 'ADMIN', profilePic: defaultAdminPic })
        await admin.save()
        console.log('Created admin user ->', adminEmail)
    } else {
        // if admin exists but no profilePic set, add default
        if(!existingAdmin.profilePic){
            await userModel.updateOne({ email: adminEmail }, { $set: { profilePic: defaultAdminPic } })
            console.log('Updated admin profilePic')
        }
        console.log('Admin already exists ->', adminEmail)
    }

    // Create sample products if none exist
    const count = await productModel.countDocuments()

    const imgUrl = (category, filename) => `${SERVER}/images/${category}/${encodeURIComponent(filename)}`

    // Dynamically generate sample products by scanning frontend assets
    const fs = require('fs')
    const path = require('path')
    const productAssetsDir = path.join(__dirname, '..', 'frontend', 'src', 'assest', 'products')

    const productsToInsert = []
    try{
        if(fs.existsSync(productAssetsDir)){
            const categories = fs.readdirSync(productAssetsDir).filter(f => fs.statSync(path.join(productAssetsDir, f)).isDirectory())
            for(const cat of categories){
                const files = fs.readdirSync(path.join(productAssetsDir, cat)).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                for(const file of files){
                    const name = path.parse(file).name.replace(/[_\-]+/g,' ').trim()
                    const base = Math.floor(Math.random() * 90000) + 1000
                    const selling = Math.floor(base * (0.6 + Math.random() * 0.3))

                    productsToInsert.push({
                        productName: name,
                        brandName: cat.charAt(0).toUpperCase() + cat.slice(1),
                        category: cat,
                        productImage: [ imgUrl(cat, file) ],
                        description: `Sample ${cat} - ${name}`,
                        price: base,
                        sellingPrice: selling
                    })

                    // allow more products (we'll ensure watches count separately)
                    if(productsToInsert.length >= 200) break
                }
                if(productsToInsert.length >= 200) break
            }

            // Ensure at least 50 watch products exist (either in DB or to be inserted)
            const watchDir = path.join(productAssetsDir, 'watches')
            const existingWatchesInInsert = productsToInsert.filter(p => p.category === 'watches').length
            const existingWatchesInDB = await productModel.countDocuments({ category: 'watches' })
            const totalExistingWatches = existingWatchesInInsert + existingWatchesInDB
            const targetWatches = 50

            if(totalExistingWatches < targetWatches){
                const needed = targetWatches - totalExistingWatches
                if(fs.existsSync(watchDir)){
                    const watchFiles = fs.readdirSync(watchDir).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                    if(watchFiles.length === 0){
                        console.log('No image files found in watches folder, cannot generate extra watch products')
                    } else {
                        for(let i = 0; i < needed; i++){
                            const file = watchFiles[i % watchFiles.length]
                            const baseName = path.parse(file).name.replace(/[_\-]+/g,' ').trim() || `Watch`
                            const uniqueName = `${baseName} ${existingWatchesInDB + existingWatchesInInsert + i + 1}`
                            const base = Math.floor(Math.random() * 90000) + 1000
                            const selling = Math.floor(base * (0.6 + Math.random() * 0.3))

                            productsToInsert.push({
                                productName: uniqueName,
                                brandName: 'Watches',
                                category: 'watches',
                                productImage: [ imgUrl('watches', file) ],
                                description: `Sample watches - ${uniqueName}`,
                                price: base,
                                sellingPrice: selling
                            })
                        }
                        console.log(`Added ${needed} extra watch products to reach ${targetWatches} watches`)
                    }
                } else {
                    console.log('Watches assets folder not found, cannot add extra watch products')
                }
            }

            // Normalize any existing 'mobile' categories to 'mobiles' (user requested canonical 'mobiles')
            const mobileCountInDB = await productModel.countDocuments({ category: 'mobile' })
            if(mobileCountInDB > 0){
                await productModel.updateMany({ category: 'mobile' }, { $set: { category: 'mobiles' } })
                console.log(`Normalized ${mobileCountInDB} products from 'mobile' to 'mobiles'`)
            }

            // Ensure at least target mobile products exist (use 'mobiles' as category)
            const mobileDir = path.join(productAssetsDir, 'mobile')
            const mobilesDir = path.join(productAssetsDir, 'mobiles')
            let mobileDirFound = null
            if(fs.existsSync(mobilesDir)) mobileDirFound = mobilesDir
            else if(fs.existsSync(mobileDir)) mobileDirFound = mobileDir

            if(mobileDirFound){
                const folderName = 'mobiles' // canonical category
                const existingMobilesInInsert = productsToInsert.filter(p => p.category === folderName).length
                const existingMobilesInDB = await productModel.countDocuments({ category: 'mobiles' })
                const totalExistingMobiles = existingMobilesInInsert + existingMobilesInDB
                const targetMobiles = 100
                console.log(`Mobile folder detected: '${path.basename(mobileDirFound)}' — in-db=${existingMobilesInDB}, queued=${existingMobilesInInsert}, totalIfInserted=${totalExistingMobiles}`)
                if(totalExistingMobiles < targetMobiles){
                    const needed = targetMobiles - totalExistingMobiles
                    const mobileFiles = fs.readdirSync(mobileDirFound).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                    if(mobileFiles.length === 0){
                        console.log('No image files found in mobile/mobiles folder, cannot generate extra mobile products')
                    } else {
                        for(let i=0;i<needed;i++){
                            const file = mobileFiles[i % mobileFiles.length]
                            const baseName = path.parse(file).name.replace(/[_\-]+/g,' ').trim() || 'Mobile'
                            const uniqueName = `${baseName} ${existingMobilesInDB + existingMobilesInInsert + i + 1}`
                            const base = Math.floor(Math.random() * 90000) + 1000
                            const selling = Math.floor(base * (0.6 + Math.random() * 0.3))
                            productsToInsert.push({
                                productName: uniqueName,
                                brandName: folderName.charAt(0).toUpperCase() + folderName.slice(1),
                                category: folderName,
                                productImage: [ imgUrl(folderName === 'mobiles' ? 'mobile' : folderName, file) ],
                                description: `Sample ${folderName} - ${uniqueName}`,
                                price: base,
                                sellingPrice: selling
                            })
                        }
                        console.log(`Added ${needed} extra mobile products to reach ${targetMobiles} mobiles`)
                    }
                } else {
                    console.log(`Mobiles already meet target (${totalExistingMobiles} >= ${targetMobiles}), no extra mobiles added`)
                }
            } else {
                console.log('Mobile assets folder not found, cannot add extra mobile products')
            }

                    // Normalize lower-case 'mouse'/'mice' to capitalized 'Mouse' category
                    const mouseLowerCount = await productModel.countDocuments({ $or: [ { category: 'mouse' }, { category: 'mice' } ] })
                    if(mouseLowerCount > 0){
                        await productModel.updateMany({ $or: [ { category: 'mouse' }, { category: 'mice' } ] }, { $set: { category: 'Mouse' } })
                        console.log(`Normalized ${mouseLowerCount} products to category 'Mouse'`)
                    }

                    // Ensure at least 50 Mouse products exist (either in DB or to be inserted)
                    const mouseDir = path.join(productAssetsDir, 'mouse')
                    const miceDir = path.join(productAssetsDir, 'mice')
                    let mouseDirFound = null
                    if(fs.existsSync(miceDir)) mouseDirFound = miceDir
                    else if(fs.existsSync(mouseDir)) mouseDirFound = mouseDir

                    if(mouseDirFound){
                        const folderName = path.basename(mouseDirFound)
                        const canonicalCategory = 'Mouse'
                        const existingMiceInInsert = productsToInsert.filter(p => p.category === canonicalCategory).length
                        const existingMiceInDB = await productModel.countDocuments({ category: canonicalCategory })
                        const totalExistingMice = existingMiceInInsert + existingMiceInDB
                        const targetMice = 50
                        console.log(`Mouse folder detected: '${folderName}' — in-db=${existingMiceInDB}, queued=${existingMiceInInsert}, totalIfInserted=${totalExistingMice}`)
                        if(totalExistingMice < targetMice){
                            const needed = targetMice - totalExistingMice
                            const mouseFiles = fs.readdirSync(mouseDirFound).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                            if(mouseFiles.length === 0){
                                console.log('No image files found in mouse/mice folder, cannot generate extra Mouse products')
                            } else {
                                for(let i = 0; i < needed; i++){
                                    const file = mouseFiles[i % mouseFiles.length]
                                    const baseName = path.parse(file).name.replace(/[_\-]+/g,' ').trim() || 'Mouse'
                                    const uniqueName = `${baseName} ${existingMiceInDB + existingMiceInInsert + i + 1}`
                                    const base = Math.floor(Math.random() * 90000) + 1000
                                    const selling = Math.floor(base * (0.6 + Math.random() * 0.3))

                                    productsToInsert.push({
                                        productName: uniqueName,
                                        brandName: 'Mouse',
                                        category: canonicalCategory,
                                        productImage: [ imgUrl(folderName === 'mice' || folderName === 'mouse' ? 'mouse' : folderName, file) ],
                                        description: `Sample ${canonicalCategory} - ${uniqueName}`,
                                        price: base,
                                        sellingPrice: selling
                                    })
                                }
                                console.log(`Added ${needed} extra Mouse products to reach ${targetMice} Mouse items`)
                            }
                        } else {
                            console.log(`Mouse already meet target (${totalExistingMice} >= ${targetMice}), no extra Mouse added`)
                        }
                    } else {
                        console.log('Mouse assets folder not found, cannot add extra Mouse products')
                    }

                    // Normalize TV/television category variants to capitalized 'Televisions'
                    const tvVariants = ['TV','tv','Television','television','televisions','Televisions']
                    const tvVariantCount = await productModel.countDocuments({ category: { $in: tvVariants } })
                    if(tvVariantCount > 0){
                        await productModel.updateMany({ category: { $in: tvVariants } }, { $set: { category: 'Televisions' } })
                        console.log(`Normalized ${tvVariantCount} products to category 'Televisions'`)
                    }

                    // Ensure at least 50 television products exist (category 'Televisions')
                    const tvCandidates = ['TV','tv','television','televisions','TVs','tvS']
                    const tvDirFound = tvCandidates.map(n => path.join(productAssetsDir, n)).find(p => fs.existsSync(p))
                    if(tvDirFound){
                        const folderName = path.basename(tvDirFound)
                        const canonicalCategory = 'Televisions'
                        const existingTVInInsert = productsToInsert.filter(p => p.category === canonicalCategory).length
                        const existingTVInDB = await productModel.countDocuments({ category: canonicalCategory })
                        const totalExistingTV = existingTVInInsert + existingTVInDB
                        const targetTV = 50
                        console.log(`TV folder detected: '${folderName}' — in-db=${existingTVInDB}, queued=${existingTVInInsert}, totalIfInserted=${totalExistingTV}`)
                        if(totalExistingTV < targetTV){
                            const needed = targetTV - totalExistingTV
                            const tvFiles = fs.readdirSync(tvDirFound).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                            if(tvFiles.length === 0){
                                console.log('No image files found in TV/television folder, cannot generate extra Televisions products')
                            } else {
                                for(let i=0;i<needed;i++){
                                    const file = tvFiles[i % tvFiles.length]
                                    const baseName = path.parse(file).name.replace(/[_\-]+/g,' ').trim() || 'Television'
                                    const uniqueName = `${baseName} ${existingTVInDB + existingTVInInsert + i + 1}`
                                    const base = Math.floor(Math.random() * 90000) + 1000
                                    const selling = Math.floor(base * (0.6 + Math.random() * 0.3))
                                    productsToInsert.push({
                                        productName: uniqueName,
                                        brandName: 'Television',
                                        category: canonicalCategory,
                                        productImage: [ imgUrl(folderName, file) ],
                                        description: `Sample television - ${uniqueName}`,
                                        price: base,
                                        sellingPrice: selling
                                    })
                                }
                                console.log(`Added ${needed} extra television products to reach ${targetTV} Televisions`)
                            }
                        } else {
                            console.log(`Televisions already meet target (${totalExistingTV} >= ${targetTV}), no extra Televisions added`)
                        }
                    } else {
                        console.log('TV assets folder not found, cannot add extra Televisions products')
                    }

                    // Normalize speakers category variants to exact 'Bluetooth Speakers'
                    const spVariants = ['speakers','Speakers','Speaker','speaker','bluetooth speakers','Bluetooth Speakers','Bluetooth speakers']
                    const spVariantCount = await productModel.countDocuments({ category: { $in: spVariants } })
                    if(spVariantCount > 0){
                        await productModel.updateMany({ category: { $in: spVariants } }, { $set: { category: 'Bluetooth Speakers' } })
                        console.log(`Normalized ${spVariantCount} products to category 'Bluetooth Speakers'`)
                    }

                    // Ensure at least 50 Bluetooth Speakers products exist (category 'Bluetooth Speakers'), productName prefix 'Bluetooth Speakers'
                    const spDir = path.join(productAssetsDir, 'speakers')
                    if(fs.existsSync(spDir)){
                        const speakerFiles = fs.readdirSync(spDir).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                        const existingSpeakersInDB = await productModel.countDocuments({ category: 'Bluetooth Speakers' })
                        const existingSpeakersInInsert = productsToInsert.filter(p => p.category === 'Bluetooth Speakers').length
                        const totalExistingSpeakers = existingSpeakersInDB + existingSpeakersInInsert
                        const targetSpeakers = 50
                        console.log(`Speakers folder detected: '${path.basename(spDir)}' — in-db=${existingSpeakersInDB}, queued=${existingSpeakersInInsert}, totalIfInserted=${totalExistingSpeakers}`)
                        if(totalExistingSpeakers < targetSpeakers){
                            const needed = targetSpeakers - totalExistingSpeakers
                            if(speakerFiles.length === 0){
                                console.log('No image files found in speakers folder, cannot generate extra Speaker products')
                            } else {
                                for(let i=0;i<needed;i++){
                                    const file = speakerFiles[i % speakerFiles.length]
                                    const uniqueName = `Bluetooth Speakers ${existingSpeakersInDB + existingSpeakersInInsert + i + 1}`
                                    const base = Math.floor(Math.random() * 90000) + 1000
                                    const selling = Math.floor(base * (0.6 + Math.random() * 0.3))
                                    productsToInsert.push({
                                        productName: uniqueName,
                                        brandName: 'Bluetooth Speakers',
                                        category: 'Bluetooth Speakers',
                                        productImage: [ imgUrl('speakers', file) ],
                                        description: `Bluetooth Speakers - ${uniqueName}`,
                                        price: base,
                                        sellingPrice: selling
                                    })
                                }
                                console.log(`Added ${needed} extra Bluetooth Speakers products to reach ${targetSpeakers} Bluetooth Speakers`)
                            }
                        } else {
                            console.log(`Speakers already meet target (${totalExistingSpeakers} >= ${targetSpeakers}), no extra Speakers added`)
                        }
                    } else {
                        console.log('Speakers assets folder not found, cannot add extra Speaker products')
                    }

                    // Normalize refrigerator category variants to exact 'Refrigerator'
                    const refVariants = ['refrigerator','Refrigerators','Refrigerators','Refrigeration','Refrigerator']
                    const refVariantCount = await productModel.countDocuments({ category: { $in: refVariants } })
                    if(refVariantCount > 0){
                        await productModel.updateMany({ category: { $in: refVariants } }, { $set: { category: 'Refrigerator' } })
                        console.log(`Normalized ${refVariantCount} products to category 'Refrigerator'`)
                    }

                    // Ensure at least 50 Refrigerator products exist (category 'Refrigerator'), productName prefix 'Refrigerator'
                    const refDir = path.join(productAssetsDir, 'refrigerator')
                    if(fs.existsSync(refDir)){
                        const refFiles = fs.readdirSync(refDir).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                        const existingRefInDB = await productModel.countDocuments({ category: 'Refrigerator' })
                        const existingRefInInsert = productsToInsert.filter(p => p.category === 'Refrigerator').length
                        const totalExistingRef = existingRefInDB + existingRefInInsert
                        const targetRef = 50
                        console.log(`Refrigerator folder detected: '${path.basename(refDir)}' — in-db=${existingRefInDB}, queued=${existingRefInInsert}, totalIfInserted=${totalExistingRef}`)
                        if(totalExistingRef < targetRef){
                            const needed = targetRef - totalExistingRef
                            if(refFiles.length === 0){
                                console.log('No image files found in refrigerator folder, cannot generate extra Refrigerator products')
                            } else {
                                for(let i=0;i<needed;i++){
                                    const file = refFiles[i % refFiles.length]
                                    const uniqueName = `Refrigerator ${existingRefInDB + existingRefInInsert + i + 1}`
                                    const base = Math.floor(Math.random() * 90000) + 1000
                                    const selling = Math.floor(base * (0.6 + Math.random() * 0.3))
                                    productsToInsert.push({
                                        productName: uniqueName,
                                        brandName: 'Refrigerator',
                                        category: 'Refrigerator',
                                        productImage: [ imgUrl('refrigerator', file) ],
                                        description: `Refrigerator - ${uniqueName}`,
                                        price: base,
                                        sellingPrice: selling
                                    })
                                }
                                console.log(`Added ${needed} extra Refrigerator products to reach ${targetRef} Refrigerators`)
                            }
                        } else {
                            console.log(`Refrigerators already meet target (${totalExistingRef} >= ${targetRef}), no extra Refrigerators added`)
                        }
                    } else {
                        console.log('Refrigerator assets folder not found, cannot add extra Refrigerator products')
                    }

                    // Normalize trimmers category to capitalized 'Trimmers'
                    const trVariants = ['trimmers','Trimmers','trimmer','Trimmer']
                    const trVariantCount = await productModel.countDocuments({ category: { $in: trVariants } })
                    if(trVariantCount > 0){
                        await productModel.updateMany({ category: { $in: trVariants } }, { $set: { category: 'Trimmers' } })
                        console.log(`Normalized ${trVariantCount} products to category 'Trimmers'`)
                    }

                    // Ensure at least 25 Trimmers products exist (category 'Trimmers'), productName prefix 'Trimmer'
                    const trDir = path.join(productAssetsDir, 'trimmers')
                    if(fs.existsSync(trDir)){
                        const trFiles = fs.readdirSync(trDir).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
                        const existingTrInDB = await productModel.countDocuments({ category: 'Trimmers' })
                        const existingTrInInsert = productsToInsert.filter(p => p.category === 'Trimmers').length
                        const totalExistingTr = existingTrInDB + existingTrInInsert
                        const targetTr = 25
                        console.log(`Trimmers folder detected: '${path.basename(trDir)}' — in-db=${existingTrInDB}, queued=${existingTrInInsert}, totalIfInserted=${totalExistingTr}`)
                        if(totalExistingTr < targetTr){
                            const needed = targetTr - totalExistingTr
                            if(trFiles.length === 0){
                                console.log('No image files found in trimmers folder, cannot generate extra Trimmer products')
                            } else {
                                for(let i=0;i<needed;i++){
                                    const file = trFiles[i % trFiles.length]
                                    const uniqueName = `Trimmer ${existingTrInDB + existingTrInInsert + i + 1}`
                                    const base = Math.floor(Math.random() * 90000) + 1000
                                    const selling = Math.floor(base * (0.6 + Math.random() * 0.3))
                                    productsToInsert.push({
                                        productName: uniqueName,
                                        brandName: 'Trimmer',
                                        category: 'Trimmers',
                                        productImage: [ imgUrl('trimmers', file) ],
                                        description: `Trimmer - ${uniqueName}`,
                                        price: base,
                                        sellingPrice: selling
                                    })
                                }
                                console.log(`Added ${needed} extra Trimmer products to reach ${targetTr} Trimmers`)
                            }
                        } else {
                            console.log(`Trimmers already meet target (${totalExistingTr} >= ${targetTr}), no extra Trimmers added`)
                        }
                    } else {
                        console.log('Trimmers assets folder not found, cannot add extra Trimmer products')
                    }
        }
    }catch(err){
        console.error('Error scanning assets',err)
    }

    // Upsert sample products so running seed repeatedly won't duplicate
    for(const p of productsToInsert){
        await productModel.findOneAndUpdate({ productName: p.productName }, { $setOnInsert: p }, { upsert: true })
    }

    console.log(`Seeded ${productsToInsert.length} sample products (upserted)`)
    const finalMobilesCount = await productModel.countDocuments({ category: 'mobiles' })
    const finalMobileCount = await productModel.countDocuments({ category: 'mobile' })
    const finalMouseCount = await productModel.countDocuments({ category: 'mouse' })
    const finalMiceCount = await productModel.countDocuments({ category: 'mice' })
    const finalMouseCapitalCount = await productModel.countDocuments({ category: 'Mouse' })
    const finalTelevisionsCount = await productModel.countDocuments({ category: 'televisions' })
    const finalTelevisionsCapitalCount = await productModel.countDocuments({ category: 'Televisions' })
    const finalSpeakersCount = await productModel.countDocuments({ category: 'Speakers' })
    const finalBluetoothSpeakersCount = await productModel.countDocuments({ category: 'Bluetooth Speakers' })
    const finalRefrigeratorCount = await productModel.countDocuments({ category: 'Refrigerator' })
    const finalTrimmersCount = await productModel.countDocuments({ category: 'Trimmers' })
    console.log(`Final category counts: mobiles=${finalMobilesCount}, mobile=${finalMobileCount}, mouse(lower)=${finalMouseCount}, mice=${finalMiceCount}, Mouse=${finalMouseCapitalCount}, televisions=${finalTelevisionsCount}, Televisions=${finalTelevisionsCapitalCount}, Speakers=${finalSpeakersCount}, "Bluetooth Speakers"=${finalBluetoothSpeakersCount}, Refrigerator=${finalRefrigeratorCount}, Trimmers=${finalTrimmersCount}`)

    process.exit(0)


    process.exit(0)
}

seed().catch(err=>{
    console.error(err)
    process.exit(1)
})