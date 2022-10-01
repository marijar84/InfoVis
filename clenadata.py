import pandas as pd # Import the library

# Read a comma-separated values (csv) file into DataFrame.
generalbooklist_df = pd.read_csv("books_1.Best_Books_Ever.csv", encoding = 'utf-8', delimiter=',')
new_bestseller_list = pd.read_csv("Merge_BestSeller_list.csv", encoding = 'utf-8', delimiter=',')

# Remove missing values in Title
generalbooklist_df.dropna(subset = ["title"], inplace=True)
new_bestseller_list.dropna(subset = ["Book_Title"], inplace = True)

# Remove duplicates in Title
generalbooklist_df.drop_duplicates(subset ="title", keep = 'first', inplace = True)
new_bestseller_list.drop_duplicates(subset ="Book_Title", keep = 'first', inplace = True)

# Remove columns were not going to use
generalbooklist_df.drop(['bookId', 'author', 'description', 'edition', 'isbn', 'characters', 'firstPublishDate', 'bbeScore', 'bbeVotes', 'coverImg', 'price'], axis = 1, inplace=True)
new_bestseller_list.drop(['Rating', 'Rank'], axis = 1, inplace=True)

# Merge the datasets and clean it up
results = pd.merge(generalbooklist_df, new_bestseller_list, how="inner", left_on='title', right_on='Book_Title', sort = True)
results.drop_duplicates(subset ="title", keep = 'first', inplace = True)
results.dropna(subset = "title", inplace = True)
results.drop(['Book_Title'], axis = 1, inplace=True)

# Creating sentinel values
results['awards'].replace(to_replace = "[]", value = 0, inplace = True)
results['setting'].replace(to_replace = "[]", value = "Missing", inplace = True)
results['genres'].replace(to_replace = "[]", value = "Missing", inplace = True)
results.fillna(value = "Missing", inplace = True)

# Insering values mannualy
results['language'].replace(to_replace = "Missing", value = "English", inplace = True)

results.to_csv('results.csv', index = False, header = True)
print(results.count())