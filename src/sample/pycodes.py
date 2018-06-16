# I don't always test my code
# but when I do

import random
codeInProduction = False

while codeInProduction == False:
  x = random.randit(0, 101)
  if x < 100:
    testMyCode = False
    print("No testing today.")
  else:
    testMyCode = True
    print("Test all the code!")
    codeInProduction = True
    print("...Damn it")

print("Done!!!")
