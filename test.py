with open('data.txt', 'r') as f:
    data = f.read()

res = [int(i) for i in data.split()]

print (res)