import torch
from torch.utils.data import Dataset

class CustomDataset(Dataset):
    def __init__(self, data):
        self.data = data
    
    def __len__(self):
        return len(self.data)
        # return 10
    
    def __getitem__(self, idx):
        image, label = self.data[idx]

        image = torch.tensor(image).float() / 255.0
        label = torch.tensor(label)

        return (image, label)